import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { openNotification } from "../../components/Notification/Notification";
import { Product } from "../../components/Product/product";
import Spinner from "../../components/Spinner";
import { CardContext } from "../../context/cardContext";
import { UserContext } from "../../context/userContext";
import api from "../../utils/api";
import { isLiked } from "../../utils/utils";



export const ProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const { handleProductLike } = useContext(UserContext);
  // const { currentUser } = useContext(UserContext);
  const currentUser = useSelector((state) => state.user.data);

  const onProductLike = (e) => {
    handleProductLike(product);
    const liked = isLiked(product.likes, currentUser?._id);
    if (liked) {
      const filteredLikes = product.likes.filter((e) => e !== currentUser._id);
      setProduct({ ...product, likes: filteredLikes });
    } else {
      const addedLikes = [...product.likes, `${currentUser._id}`];
      setProduct({ ...product, likes: addedLikes });
    }
  };

  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    api
      .getProductById(productId)
      .then((productData) => setProduct(productData))
      .catch((err) => {
        navigate("/");
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const onSendReview = async (data) => {
    try {
      const result = await api.addReview(product._id, data);
      openNotification("success", "Success", "Ваш отзыв успешно отправлен");
      setProduct({ ...result });
    } catch (error) {
      openNotification("error", "Error", "Не получилось отправить отзыв");
    }
  };

  const deleteReview = async (id) => {
    try {
      const result = await api.deleteReview(product._id, id);
      setProduct({ ...result });
      openNotification("success", "Success", "Ваш отзыв успешно удален");
    } catch (error) {
      openNotification("error", "Error", "Не получилось удалить отзыв");
    }
  };

  useEffect(() => {
    const comments = product?.reviews ?? product?.comments;
     if (comments && Array.isArray(comments)) {
      setReviews([
        ...comments?.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        ),
      ]);
    }
  }, [product?.reviews]);


  console.log(product);

  return (
    <>
      <div className="content__cards">
        {isLoading ? (
          <Spinner />
        ) : (
          <Product
            {...product}
            reviews={reviews}
            onProductLike={onProductLike}
            setProduct={setProduct}
            onSendReview={onSendReview}
            deleteReview={deleteReview}
          />
        )}
      </div>
    </>
  );
};
