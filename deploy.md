# Deployment Instructions

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Steps to Deploy

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Create and configure the [.env.local](http://_vscodecontentref_/1) file**:
    Ensure you have a [.env.local](https://docs.google.com/document/d/1MNhEpeYAkI-VzkV0Smqv3-c_14SlUMg3cCWbw93irIY/edit?usp=sharing) file in the root directory of your project with the necessary environment variables. Here is an example:
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

3. **Build and start the Docker container**:
    ```sh
    docker-compose up -d
    ```

4. **Access the application**:
    Open your web browser and navigate to `http://localhost:3001`.

## Notes

- If you need to change the port, update the `PORT` variable in the [.env.local](https://docs.google.com/document/d/1MNhEpeYAkI-VzkV0Smqv3-c_14SlUMg3cCWbw93irIY/edit?usp=sharing) file and the `ports` section in the `docker-compose.yml` file accordingly.
- Ensure that no other service is using the specified port on your host machine.