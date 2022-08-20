package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/baderkha/library/pkg/conditional"
	"github.com/baderkha/library/pkg/db"
	"github.com/baderkha/library/pkg/json"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	DefaultConfigPath = "env.json"
)

var (
	// evironment variable
	Env Environ

	dbGor *gorm.DB

	S3 *s3.S3

	IsInit bool
)

// Environ : config that mimics hte schema of the env json
type Environ struct {
	DBHost                         string `json:"db_host"`
	DBPort                         string `json:"db_port"`
	DBSchema                       string `json:"db_schema"`
	DBFlavour                      string `json:"db_flavour"`
	DBUserName                     string `json:"db_user_name"`
	DBPassword                     string `json:"db_password"`
	DBPasswordFromSecrets          bool   `json:"is_db_password_from_secrets"`
	Domain                         string `json:"domain"`
	CookieName                     string `json:"cookie_name"`
	ResetPasswordFrontEndURLPath   string `json:"reset_password_front_end_url_path"`
	VerifyEmailBackendURLPath      string `json:"verify_email_backend_url_path"`
	CookieExpiryDurationMinutes    int64  `json:"cookie_expiry_time_minutes"`
	ResetPasswordExpiryTimeMinutes int64  `json:"reset_password_expiry_time_minutes"`
	S3Bucket                       string `json:"bucket"`
	HTTPPort                       string `json:"http_port"`
	AWSRegion                      string `json:"aws_region"`
	SendGridAPIToken               string `json:"send_grid_api_token"`
	SendGridEmail                  string `json:"send_grid_email"`
	GoogleClientID                 string `json:"google_client_id"`
}

func Init() {
	if !IsInit {
		envFile := os.Getenv("ENV_FILE")
		filePath := conditional.Ternary(envFile != "", envFile, DefaultConfigPath)
		cfg := json.MustReadJSONFromFile[Environ](filePath)
		Env = cfg
		IsInit = true
	}
}

func DefaultEnv() *Environ {
	return &Env
}

func GetDB() *gorm.DB {
	if dbGor == nil {
		Init()
		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			logger.Config{
				SlowThreshold:             time.Second, // Slow SQL threshold
				LogLevel:                  logger.Info, // Log level
				IgnoreRecordNotFoundError: false,       // Ignore ErrRecordNotFound error for logger
				Colorful:                  true,        // Disable color
			},
		)

		dsn := db.GetDSN(db.DialectMYSQL, Env.DBHost, Env.DBUserName, Env.DBPassword, Env.DBPort, Env.DBSchema, "utf8mb4&parseTime=True&loc=Local")
		fmt.Println(dsn)
		db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err != nil {
			panic(err)
		}
		dbGor = db
	}
	return dbGor
}

func GetS3() *s3.S3 {
	if S3 == nil {
		Init()
		sess, err := session.NewSession(&aws.Config{
			Region: &Env.AWSRegion},
		)

		if err != nil {
			panic(err)
		}

		// Create S3 service client
		svc := s3.New(sess)
		S3 = svc
	}

	return S3
}
