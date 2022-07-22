package model

import "github.com/baderkha/library/pkg/store/entity"

const (
	LinkTypeCustom = "CUSTOM"
	LinkTypeSocial = "SOCIAL_FACEBOOK"
)

// Link on the page
type Link struct {
	entity.BaseOwned
	Label         string `json:"label" db:"label" gorm:"type:varchar(255)"`
	Type          string `json:"type" db:"type" gorm:"type:varchar(50)"`
	Href          string `json:"href" db:"href"`
	PageId        string `json:"page_id" db:"paged_id" gorm:"type:varchar(100);index"`
	ButtonPhotoId string `json:"button_photo_id" db:"button_photo_id" gorm:"type:varchar(100);index"`
}

func (l Link) TableName() string {
	return "link"
}
