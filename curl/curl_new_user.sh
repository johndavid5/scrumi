# curl -L : follow redirects
set -x
#curl -L -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"arnie\", \"password\":\"pass1234\"}" http://localhost/scrumi/api/users
# curl -L -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"cindy\", \"password\":\"pass1234\"}" http://localhost/scrumi/api/users
curl -L -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"john\", \"password\":\"pass1234\"}" http://localhost/scrumi/api/users
set +x
