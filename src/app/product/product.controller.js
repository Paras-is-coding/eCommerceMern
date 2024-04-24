const { deleteFile } = require("../../config/helper");
const CartModel = require("../cart/cart.model");
const OrderModel = require("../cart/order.model");
const productSvc = require("./product.service");
const ReviewModel = require("./review/review.model");

class ProductController {
  productCreate = async (req, res, next) => {
    try {
      // collect all data move code to services
      let payload = productSvc.transformCreateRequest(req);

      payload.slug = await productSvc.checkSlug(payload.slug);

      if (!payload.images || payload.images === "") {
        delete payload.images;
      }

      // create product
      let created = await productSvc.storeProduct(payload);

      res.json({
        result: created,
        message: "Product created successfully!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  listAllProducts = async (req, res, next) => {
    try {
      // handle search,sort,paginate
      // search
      let filter = {};

      if (req.query["search"]) {
        filter = {
          // search keyword on title,status
          $or: [
            { title: new RegExp(req.query["search"], "i") },
            { summary: new RegExp(req.query["search"], "i") },
            { description: new RegExp(req.query["search"], "i") },
          ],
        };
      }

      filter = {
        $and: [{ createdBy: req.authUser._id }, { ...filter }],
      };

      // pagination
      let page = +req.query["page"] || 1; // + converts string from query to number
      let limit = +req.query["limit"] || 15;

      let total = await productSvc.countData(filter);
      // total=100, 7 page
      // 1st =>0-14, 2nd=>15-29 ...
      let skip = (page - 1) * limit;

      let list = await productSvc.listAllData(filter, {
        offset: skip,
        limit: limit,
      });
      res.json({
        result: list,
        message: "Product fetched successfully!",
        meta: {
          total: total,
          currentPage: page,
          limit: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getDataById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await productSvc.getData({
        _id: id,
        createdBy: req.authUser._id,
      });

      res.json({
        result: data,
        message: "Product fetched!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  updateById = async (req, res, next) => {
    try {
      // TOTO:Update Product
      const productId = req.params.id;

      // update operation
      const payload = productSvc.transformEditRequest(req);

      if (!payload.images || payload.images === "") {
        delete payload.images;
      }

      const oldProduct = await productSvc.updateById(productId, payload);

      if (payload.images) {
        // delete Old image
        deleteFile("./public/uploads/product/", oldProduct.images);
      }

      res.json({
        result: oldProduct,
        message: "Product updated successfully!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteById = async (req, res, next) => {
    try {
      const productId = req.params.id;
      await productSvc.getData({
        _id: productId,
        // createdBy:req.authUser._id
      });

      let deleteProduct = await productSvc.deleteById(productId);

      console.log(deleteProduct);
      if (deleteProduct.images) {
        deleteProduct.images.forEach((img) => {
          console.log(img);

          deleteFile("./public/uploads/product/", img)
            .then(() => {
              console.log("File deleted successfully");
            })
            .catch((error) => {
              console.error("Error deleting file:", error);
            });
        });
      }

      res.json({
        result: deleteProduct,
        message: "Product Deleted Successfully!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  listHome = async (req, res, next) => {
    try {
      let filter = {};
  
      if (req.query["search"]) {
        filter.$or = [
          { title: new RegExp(req.query["search"], "i") },
          { description: new RegExp(req.query["search"], "i") },
        ];
      }
  
      if (req.query["category"]) {
        filter.category = { $in: [req.query["category"]] };
      }
  
      if (req.query["brand"]) {
        filter.brand = req.query["brand"];
      }
  
      // Add condition for status and other filters
      filter = {
        $and: [
          { status: "active" },
          { ...filter },
        ],
      };
  
      // pagination
      let page = req.query["page"] || 1;
      let limit = req.query["limit"] || 15;
      let skip = (page - 1) * limit;
  
      // Sorting
      let sort = { _id: "DESC" };
      if (req.query.sort) {
        let split = req.query.sort.split(","); // sort=title,desc
        sort = { [split[0]]: split[1] };
      }
  
      const response = await productSvc.listAllData(
        filter,
        {
          offset: skip,
          limit: limit,
        },
        {
          sort: sort,
        }
      );
  
      res.json({
        result: response,
        message: "Product fetched!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
  

  getDetailBySlug = async (req, res, next) => {
    try {
      let productDetail = await productSvc.getData({
        slug: req.params.slug,
        status: "active",
      });

      // TODO: Product list
      res.json({
        result: {
          product: productDetail,
        },
        message: "product Detail from Slug",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };




  // check order before allowing to review
  checkOrder = async (req, res, next) => {
    try {
      const {productId} = req.params; 
      const userId = req.authUser._id; 
  
      // Check if the user has ordered the product
      const order = await CartModel.findOne({productId:productId,buyerId: userId });
      if (!order.orderId) {
        throw{code:400,message:"You're unauthorized to review as you have not ordered product!"}
      }
      next();
    } catch (error) {
      next(error);
    }
  };




  // Create a review for a product
  createReview = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { review, rate } = req.body;
      const reviewerId = req.authUser._id;

      const newReview = new ReviewModel({ productId, reviewerId, review, rate });
      await newReview.save();

      res.json({
        result: {
          review:newReview,
        },
        message: "Successfully added review!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update a review for a product
  updateReview = async (req, res, next) => {
    try {
      const { productId, reviewId } = req.params;
      const { review, rate } = req.body;
      const reviewerId = req.authUser._id;

      const existingReview = await ReviewModel.findById(reviewId);
      if (!existingReview) {
        throw({code:401,message:"Review not found!"})
      }

      if (existingReview.reviewerId.toString() !== reviewerId.toString()) {
        throw({code:403,message:"You're not authorized to update review!"})
      }

      existingReview.review = review;
      existingReview.rate = rate;
      await existingReview.save();

      res.json({
        result: {
          review:existingReview,
        },
        message: "Successfully updated review!",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };


  getAllReviews = async (req, res, next) => {
    try {
      const productId = req.params.productId;
  
    
      const reviews = await ReviewModel.find({ productId });
  
      res.json({
        reviews: reviews,
        message: "All reviews fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };







}

const productCtrl = new ProductController();
module.exports = productCtrl;
