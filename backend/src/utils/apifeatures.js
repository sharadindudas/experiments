export class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query; // Mongoose query
        this.queryStr = queryStr; // Query params
    }

    // Search feature
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i"
                  }
              }
            : {};
        console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filter feature
    filter() {
        const queryStrCopy = { ...this.queryStr };
        // Remove fields for category
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((key) => delete queryStrCopy[key]);

        // Filter for price
        console.log(queryStrCopy);
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        /*
            50 products so 1 page -> 10 products
            1 page -> 10 products (skip = 0)
            2 page -> 20 products (skip = 10)
            3 page -> 30 products (skip = 20)

            skip = result * (current page - 1)
                    10 * 1  - 1 = 0
                    10 * 2 - 1 = 10
        */
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
