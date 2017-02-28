use scrumi;

//db.objectives.find({});

db.objectives.find(
{
 //start: { '$gte': '2017-01-03', '$lte': '2017-01-08' },
 //finish: { '$gte': '2017-01-10', '$lte': '2017-01-12' }
}
);

// [2017-02-28 02:08:14.513] [INFO] console - connectCallback(): Calling collection
// .find(), query =  { start: { '$gte': '2017-01-03', '$lte': '2017-01-08' },
//  finish: { '$gte': '2017-01-10', '$lte': '2017-01-12' } } sort =  {} skip=0, limit=1...
