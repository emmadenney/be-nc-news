
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
FROM articles 
JOIN comments 
ON articles.article_id = comments.article_id 
ORDER BY articles.created_at DESC;
GROUP BY articles.author;