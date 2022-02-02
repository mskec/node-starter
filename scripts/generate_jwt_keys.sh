#!/bin/bash

mkdir -p tmp
openssl genpkey -algorithm RSA -out tmp/private.pem -pkeyopt rsa_keygen_bits:4096
openssl rsa -pubout -in tmp/private.pem -out tmp/public.pem

# Replace newline with two characters \n
cat tmp/private.pem | tr '\n' '\\' | sed -E 's/\\/\\n/g' > tmp/private.r.pem
cat tmp/public.pem | tr '\n' '\\' | sed -E 's/\\/\\n/g' > tmp/public.r.pem

# Create output file
echo -n 'JWT_PUBLIC_KEY=' > tmp/output.txt &&
cat tmp/public.r.pem >> tmp/output.txt
echo -ne 'JWT_PRIVATE_KEY=' >> tmp/output.txt
cat tmp/private.r.pem >> tmp/output.txt
cat tmp/output.txt

echo -e '\nCopy output with JWT_PUBLIC_KEY and JWT_PRIVATE_KEY to your .env file'

rm -rd tmp
