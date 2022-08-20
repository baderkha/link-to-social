package main

import (
	"fmt"
	"log"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func main() {
	from := mail.NewEmail("Example User", "do-not-reply@linktosocials.com")
	subject := "Sending with SendGrid is Fun"
	to := mail.NewEmail("Example User", "ahmad@baderkkhan.org")
	plainTextContent := "and easy to do anywhere, even with Go"
	htmlContent := "<strong>and easy to do anywhere, even with Go</strong>"
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	response, err := client.Send(message)
	if err != nil {
		log.Println(err)
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}
}
