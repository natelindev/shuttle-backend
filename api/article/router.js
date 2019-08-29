import express from 'express';
import mongoose from 'mongoose';
import { param } from 'express-validator';
import Article from './model';
import validate from '../../util/apiValidator';
import authorize from '../../util/permisson';
import asyncHandler from '../../util/errorHandler';

const router = express.Router();

/**
 * @api {get} /article
 * @apiName GetArticles
 * @apiDescription Retrieve all Articles
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} All Articles.
 */
router.get(
  '/article',
  asyncHandler(async (req, res) => {
    const articles = await Article.find({});
    if (articles) {
      res.send(articles);
    } else {
      res.status(204).end();
    }
  })
);

/**
 * @api {post} /article
 * @apiName createArticle
 * @apiDescription Create a new Article
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiSuccess {String} Location CreatedArticleURI
 */
router.post(
  '/article',
  asyncHandler(async (req, res) => {
    const article = await new Article(req.body).save();
    res.status(201).send({ Location: `${req.url}/${article._id}` });
  })
);

/**
 * @api {put} /Article
 * @apiName updateArticles
 * @apiDescription Bulk update of Articles
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiSuccess (204) Empty
 */
router.put(
  '/article',
  asyncHandler(async (req, res) => {
    const articles = req.body;
    const bulkOperation = Article.collection.initializeUnorderedBulkOp();
    articles.forEach(article => {
      const id = mongoose.Types.ObjectId(article._id);
      bulkOperation.find({ _id: id }).updateOne({
        $set: {
          title: article.title,
          author: article.author,
          content: article.content,
          tags: article.tags,
          status: article.status,
          headerImg: article.headerImg,
          images: article.images,
          viewCount: article.viewCount,
          likeCount: article.likeCount
        }
      });
    });
    await bulkOperation.execute();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /article
 * @apiName deleteArticles
 * @apiDescription Delete All Articles
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/article',
  authorize(consts.roles.admin),
  asyncHandler(async (req, res) => {
    await Article.deleteMany({});
    res.status(204).end();
  })
);

/**
 *
 * @api {get} /article/:articleId
 * @apiName getArticleById
 * @apiDescription Get an Article by Id
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} articleId The Id of the Article
 *
 * @apiSuccess (200) {String} Article The requested article
 *
 */
router.get(
  '/article/:articleId',
  validate([
    param('articleId')
      .matches(/^[a-fA-F0-9]{24}$/)
      .withMessage('Invalid articleId')
  ]),
  asyncHandler(async (req, res) => {
    const article = await Article.findOne({ _id: req.params.articleId });
    if (article) {
      res.send(article);
    } else {
      res.status(404).end();
    }
  })
);

/**
 *
 * @api {put} /article/:articleId
 * @apiName updateArticleById
 * @apiDescription Update an Article by Id
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} articleId The Id of the Article
 *
 * @apiSuccess (204) Empty
 *
 */
router.put(
  '/article/:articleId',
  validate([
    param('articleId')
      .matches(/^[a-fA-F0-9]{24}$/)
      .withMessage('Invalid articleId')
  ]),
  asyncHandler(async (req, res) => {
    const article = await Article.findByIdAndUpdate(
      req.params.articleId,
      req.body
    );
    article.save();
    res.status(204).end();
  })
);

/**
 *
 * @api {patch} /article/:articleId
 * @apiName modifyArticleById
 * @apiDescription Update an Article by Id
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} articleId The Id of the Article
 *
 * @apiSuccess (204) Empty
 *
 */
router.patch(
  '/article/:articleId',
  validate([
    param('articleId')
      .matches(/^[a-fA-F0-9]{24}$/)
      .withMessage('Invalid articleId')
  ]),
  asyncHandler(async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.articleId, {
      $set: req.body
    });
    article.save();
    res.status(204).end();
  })
);

/**
 *
 * @api {delete} /article/:articleId
 * @apiName deleteArticleById
 * @apiDescription Delete an Article by Id
 * @apiGroup Article
 * @apiVersion  0.0.1
 *
 * @apiParam  {String} articleId The Id of the Article
 *
 * @apiSuccess (204) Empty
 *
 */
router.delete(
  '/article/:articleId',
  validate([
    param('articleId')
      .matches(/^[a-fA-F0-9]{24}$/)
      .withMessage('Invalid articleId')
  ]),
  asyncHandler(async (req, res) => {
    await Article.findByIdAndRemove(req.params.articleId);
    res.status(204).end();
  })
);

export default router;
