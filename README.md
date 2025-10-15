# Automated Mail Sender

This is a simple Node.js application that sends an email with the latest downloaded file as an attachment. It uses Express.js for the server, Nodemailer to send the email, and EJS for dynamic email templating.

## Features

-   **Automated Attachment:** Automatically finds the most recently downloaded file in your `Downloads` folder and attaches it to the email.
-   **Dynamic Email Templates:** Uses EJS templates to create personalized and customizable email bodies.
-   **Simple API:** A single `POST` endpoint to trigger the email sending process.

## API

### Send an Email

-   **URL:** `/`
-   **Method:** `POST`
-   **Body:**

    ```json
    {
      "email": "recipient@example.com",
      "username": "Alex",
      "customMessage": "Here is your weekly report."
    }
    ```

-   **`email` (required):** The email address of the recipient.
-   **`username` (optional):** The name of the recipient to be used in the email greeting. Defaults to "User".
-   **`customMessage` (optional):** A custom message to be included in the email body. A default message will be used if not provided.
