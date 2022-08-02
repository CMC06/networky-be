const advancedResults = (model, populate) => async (req, res, next) => {
  // save copy of query to variable
  const reqQuery = {...req.query};

  // Fields to exclude from request query 
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields array and remove any existing from the reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // catch mongoDB operators and place into correct syntax
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Find the resource
  let query = model.find(JSON.parse(queryStr));

  // Select fields if original query included select
  if(req.query.select) {
    //split the comma separated string into an array, then join with spaces to pass to select method
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Handle sort fields (if any)
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
    // limit number of results per page
  const limit = parseInt(req.query.limit, 10)  || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  //Check for populate in args and add to query if exists
  if(populate) {
    query = query.populate(populate);
  }

  //Execute query
  const results = await query;

  // Pagination result
  const pagination = {};

  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if(startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next();

}

module.exports = advancedResults;