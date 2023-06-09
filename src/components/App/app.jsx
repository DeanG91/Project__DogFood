import { useState, useEffect } from "react";
import Footer from "../Footer/footer.tsx";
import Header from "../Header/header";
import Logo from "../Logo/logo";
import Search from "../Search/search";
import "./index.scss";
import SeachInfo from "../SeachInfo";
import api from "../../utils/api";
import { ProductPage } from "../../pages/product/product";
import { CatalogPage } from "../../pages/catalog/catalog";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NoMatchFound } from "../../pages/noMatchFound/NoMatchFound";
import { UserContext } from "../../context/userContext";
import { CardContext } from "../../context/cardContext";
import { ThemeContext, themes } from "../../context/themeContext";
import { FaqPage } from "../../pages/faq/faq-page";
import { Favorite } from "../../pages/favorites/favorites";
import { isLiked } from "../../utils/utils";
import useDebounce from "../../hooks/useDebounce";
import { Modal } from "../Modal/modal";
import { useLocation } from "react-router-dom";
import { useCallback } from "react";
import { Login } from "../Login/login";
import { Register } from "../Register/Register";
import { ResetPassword } from "../ResetPassword/ResetPassword";
import { StyleGuide } from "../StyleGuide/StyleGuide";
import { Chart } from "../Chart/Chart";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import { Profile } from "../Profile/Profile";
// import { getAllProducts } from "../../storage/actions/productsActions";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../storageTK/user/userSlice";
import { parseJwt } from "../../utils/parseJWT";
import { useCurrentWidth } from "../../hooks/useCurrentWidth";
import { EditPost } from "../EditPost/EditPost";
import { CreateProduct } from "../CreateProduct/CreateProduct";
import { BasketPage } from "../../pages/basket/basketPage";
import { TsExample } from "./index.tsx";
// import { Test } from "./index.tsx";
// import i18n from "i18next";
// import { useTranslation, initReactI18next } from "react-i18next";

function App() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [basket, setBasket] = useState([]);
  const [activeModal, setActiveModal] = useState(true);
  const [isAuthentificated, setAuthentificated] = useState(false);
  const [isMobileView, setMobileView] = useState(false);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const debounceSearchQuery = useDebounce(searchQuery, 2000);
  const navigate = useNavigate();

  // const cardsProd = useSelector(state => state.products.list.products);

  // отфильтровал карточки на клиенте по времени создания и пустому изображению
  const checkCardLocal = (item) => {
    // return true
    // const isMine = id === item.author.id
    const image = item.pictures || item.image;
    return (
      !image.includes("default-image") &&
      new Date(item.created_at) < new Date("2022-12-05T11:22:43.008Z")
    );
  };

  const handleRequest = () => {
    api
      .search(debounceSearchQuery)
      .then((res) => setCards(res.filter((e) => checkCardLocal(e))))
      .catch((err) => console.log(err));
  };

  const callback = () => {
    console.log('aasdadad');
  }

  useEffect(() => {
    document.addEventListener('keydown', callback)
    return () => {
      document.removeEventListener('keydown', callback);
    }
  }, [])

  useEffect(() => {
    if (!isAuthentificated) {
      return;
    }
    handleRequest();
  }, [debounceSearchQuery]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleRequest();
    navigate("/");
  };

  const handleInputChange = (inputValue) => {
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    if (!isAuthentificated) {
      return;
    }
    Promise.all([api.getProductsList(page, size), api.getUserInfo()]).then(
      ([productsData, userData]) => {
        setCards(productsData.products.filter((e) => checkCardLocal(e)));
        setTotal(productsData.total);
        setCurrentUser(userData);
        const favProducts = productsData.products.filter((product) =>
          isLiked(product.likes, userData._id)
        );
        setFavorites(favProducts);
      }
    );
  }, [isAuthentificated, page, size]);

  useEffect(() => {
    if (!isAuthentificated) {
      return;
    }
    dispatch(fetchUser());
  }, [isAuthentificated]);

  const handleProductLike = useCallback(
    (product) => {
      const liked = isLiked(product.likes, currentUser?._id);
      api.changeLikeProduct(product._id, liked).then((newCard) => {
        const newProducts = cards.map((cardState) => {
          return cardState._id === newCard._id ? newCard : cardState;
        });

        if (!liked) {
          setFavorites((prevState) => [...prevState, newCard]);
        } else
          setFavorites((prevState) => {
            return prevState.filter((card) => card._id !== newCard._id);
          });
        setCards(newProducts.filter((e) => checkCardLocal(e)));
      });
    },
    [cards, currentUser?._id]
  );

  const sortedData = useCallback((currentSort) => {
    switch (currentSort) {
      case "expensive":
        setCards((state) => [...state.sort((a, b) => b.price - a.price)]);
        break;
      case "cheep":
        setCards([...cards.sort((a, b) => a?.price - b?.price)]);
        break;
      case "newest":
        setCards([
          ...cards.sort(
            (a, b) => new Date(b?.created_at) - new Date(a?.created_at)
          ),
        ]);
        break;
      case "popular":
        setCards([
          ...cards.sort((a, b) => b?.likes?.length - a?.likes?.length),
        ]);
        break;
      default:
        setCards([...cards.sort((a, b) => a.price - b.price)]);
        break;
    }
  },[cards]);

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const initialPath = location.state?.initialPath;

  useEffect(() => {
    const haveToken = localStorage.getItem("token");
    // const result = parseJwt(haveToken);
    // console.log({ result });
    // const isNotExpires = new Date() > new Date(result.exp);
    // console.log({ isNotExpires });
    setAuthentificated(!!haveToken);
  });

  let width = useCurrentWidth();

  useEffect(() => {
    if (width < 375) {
      setMobileView(true)
    } else setMobileView(false)
  }, [width])

  const cardProvider = {
    cards,
    favorites,
    onSortData: sortedData,
    setBasket,
    basket
  };

  const userProvider = {
    currentUser,
    handleProductLike,
    isAuthentificated,
    activeModal,
    setActiveModal,
    setAuthentificated,
    setCurrentUser,
    setMobileView,
    isMobileView,
    setSize,
    setCards,
    setPage,
    page,
    size,
    total
  };

  // console.log({ cards });

  const authRoutes = (
    <>
      <Route
        path="login"
        element={
          <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
            <Login />
          </Modal>
        }
      ></Route>
      <Route
        path="register"
        element={
          <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
            <Register />
          </Modal>
        }
      ></Route>
      <Route
        path="reset-pass"
        element={
          <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
            <ResetPassword setAuthentificated={setAuthentificated} />
          </Modal>
        }
      ></Route>
    </>
  );
  return (
    <>
      <CardContext.Provider value={cardProvider}>
        <UserContext.Provider value={userProvider}>
          <Header>
            <>
              <Logo className="logo logo_place_header" href="/" />
              <Search onSubmit={handleFormSubmit} onInput={handleInputChange} />
            </>
          </Header>
          {isAuthentificated ? (
            <main className={`content container`}>
              <SeachInfo searchCount={cards.length} searchText={searchQuery} />

              <Routes
                location={
                  backgroundLocation && {
                    ...backgroundLocation,
                    path: initialPath || location,
                  }
                }
              >
                <Route path="/" element={<CatalogPage />}></Route>
                <Route
                  path="product/:productId"
                  element={<ProductPage />}
                ></Route>
                <Route path="profile" element={<Profile />}></Route>
                <Route path="faq" element={<FaqPage />}></Route>
                <Route
                  path="favorites"
                  element={
                    <PrivateRoute loggedIn={isAuthentificated}>
                      <Favorite />
                    </PrivateRoute>
                  }
                ></Route>
                <Route path="visual" element={<Chart />}></Route>
                <Route path="basket" element={<BasketPage />}></Route>

                {authRoutes}
                <Route path="style-guide" element={<StyleGuide />}></Route>
                <Route
                  path="edit-post/:postId"
                  element={
                    <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                      <EditPost />
                    </Modal>
                  }
                ></Route>
                <Route path="*" element={<NoMatchFound />}></Route>
              </Routes>

              {backgroundLocation && <Routes>{authRoutes}</Routes>}
            </main>
          ) : (
            <div className="not-auth">
              Авторизуйтесь пожалуйста
              <Routes>{authRoutes}</Routes>
            </div>
          )}
          <Footer />
          <TsExample />
        </UserContext.Provider>
      </CardContext.Provider>
    </>
  );
}

export default App;

// Как сравнивает реакт
// 1 реакт сравнивает по ссылке стейты
// 2 реакт сравнивает по содержимому
// setCards()
