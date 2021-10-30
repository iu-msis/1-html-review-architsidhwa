<?php


try {
    $_POST = json_decode(
                file_get_contents('php://input'), 
                true,
                2,
                JSON_THROW_ON_ERROR
            );
} catch (Exception $e) {
    header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
    // print_r($_POST);
    // echo file_get_contents('php://input');
    exit;
}

require("class/DbConnection.php");

$db = DbConnection::getConnection();

$stmt = $db->prepare(
  'UPDATE book SET 
    book_title = ?,
    author = ?,
    publication_year = ?,
    publisher = ?,
    page_count = ?,
    msrp = ?
  WHERE book_id = ?'
);

$stmt->execute([
  $_POST['book_title'],
  $_POST['author'],
  $_POST['publication_year'],
  $_POST['Publisher'],
  $_POST['publisher'],
  $_POST['msrp'],
  $_POST['book_id']
]);

header('HTTP/1.1 303 See Other');
header('Location: ../book/');