package config

import (
	"os"

	"github.com/baderkha/library/pkg/conditional"
	"github.com/baderkha/library/pkg/db"
	"github.com/baderkha/library/pkg/json"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	DefaultConfigPath = "env.json"
)

var (
	// evironment variable
	Env Environ

	dbGor *gorm.DB
)

// Environ : config that mimics hte schema of the env json
type Environ struct {
	DBHost                      string `json:"db_host"`
	DBPort                      string `json:"db_port"`
	DBSchema                    string `json:"db_schema"`
	DBFlavour                   string `json:"db_flavour"`
	DBUserName                  string `json:"db_user_name"`
	DBPassword                  string `json:"db_password"`
	DBPasswordFromSecrets       bool   `json:"is_db_password_from_secrets"`
	Domain                      string `json:"domain"`
	CookieExpiryDurationMinutes int64  `json:"cookie_expiry_time_minutes"`
}

func init() {
	envFile := os.Getenv("ENV_FILE")
	filePath := conditional.Ternary(envFile != "", envFile, DefaultConfigPath)
	cfg := json.MustReadJSONFromFile[Environ](filePath)
	Env = cfg
}

func DefaultEnv() *Environ {
	return &Env
}

func GetDB() *gorm.DB {
	if dbGor == nil {
		db, err := gorm.Open(mysql.Open(db.GetDSN(db.DialectMYSQL, Env.DBHost, Env.DBUserName, Env.DBPassword, Env.DBPort, Env.DBSchema)), &gorm.Config{})
		if err != nil {
			panic(err)
		}
		dbGor = db
	}
	return dbGor
}
