import { Select } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/card";
import CardList from "../../components/CardList/card-list";
import Sort from "../../components/Sort/sort";
import { CardContext } from "../../context/cardContext";
import { UserContext } from "../../context/userContext";

import "./index.css";

export const CatalogPage = () => {
  const { cards } = useContext(CardContext);
  const { handleProductLike, size, setSize, page, setPage, total } = useContext(UserContext);
  const [paginated, setPaginated] = useState([]);
  const [pageOptions, setPageOptions] = useState([]);



  const optionsSize = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 50,
      label: '50'
    },
  ];

  const paginator = useCallback(() => {
    // const total = Math.ceil(cards.length / size);
    // console.log({ total });
    const arr = new Array(total).fill({});
    const newArr = arr.map((e, i) => ({
      value: i + 1,
      label: `${i + 1}`
    }))
    console.log({ arr, newArr, cards })
    setPageOptions(newArr);
    // setPage(1);
  }, [cards.length, size])

  useEffect(() => {
    paginator()
  }, [paginator, page, size, cards.length])

  const navigate = useNavigate()



  //GET https://api.react-learning.ru/v2/:groupId/posts/paginate?page=<номер страницы>&limit=<число ограничивающее вывод на страницу>&query=<строка фильтрации 
  // по title> //добавление навигации
  // https://api.react-learning.ru/v2/:groupId/posts/paginate?page=${page}&limit=${size}

  // useEffect(() => {
  //   const sliced = cards.slice((page-1) * size, size * page)
  //   setPaginated(sliced);
  //   navigate(`/?page=${page}&limit=${size}`)
  // }, [cards, page, size, navigate]);

  return (
    <div className="catalog-page">
      <Sort />
      <div className="content__cards">
        {/* <CardList cards={cards} onProductLike={handleProductLike} /> */}
        <div className="cards">
          {cards.map((item) => (
            <Card key={item._id} {...item} item={item} onProductLike={handleProductLike} />
          ))}
        </div>
      </div>
      <div>

        <Select value={size} options={optionsSize} onChange={setSize} />
        <Select style={{ width: 120 }} value={page} options={pageOptions} onChange={setPage} />

      </div>
    </div>
  );
};
