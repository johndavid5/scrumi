REM HINT: try doing db.users.remove({}); for a fresh start...
REM curl -v --noproxy athena --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -X POST --data "{\"username\":\"arnie\", \"password\":\"pass\"}" http://athena:3000/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"arnie\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"cindy\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"kirby\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"sully\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"arias\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"cook\", \"password\":\"pass\"}" http://localhost:3002/api/users
curl -v --noproxy localhost --trace-ascii curl_new_user.trace-ascii.out -H "Content-Type: application/json" -XPOST --data "{\"username\":\"bennett\", \"password\":\"pass\"}" http://localhost:3002/api/users
