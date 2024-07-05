function wrapAsync (fn)  {
    return function (err,req,res,next) {
        fn(err,req,res,next).catch(next);
    }
}


module.exports  = wrapAsync;

// wrapAsync is another function of handling errors try-catch  type method 