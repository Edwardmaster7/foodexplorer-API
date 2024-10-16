To generate a secret key for use with the RS256 (RSA Signature with SHA-256) algorithm in JSON Web Tokens (JWT), you need to generate an RSA key pair consisting of a public key and a private key. Here's how you can do it:

The following commands may be called by the following command:
>npm run rsa

### 1. Generate the RSA key pair :

You can use the OpenSSL command-line tool to generate the RSA key pair. Open your terminal or command prompt and run the following command:
>openssl genrsa -out private.pem 2048
This command will generate a 2048-bit RSA private key and save it to the 
private.pem file.

### 2. Extract the public key
Next, you need to extract the public key from the private key file. Run the following command:
>openssl rsa -in private.pem -outform PEM -pubout -out public.pem
This command will extract the public key from the private.pem file and save it to the public.pem file.
