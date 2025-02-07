import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import { useDispatch, useSelector } from "react-redux";
import { setMyProducts, setProducts } from "../redux/productsSlice";
import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "../service/constants";
import { request } from "../service/api";
const Container = styled.div`
  padding: 0 ${sizeCalculator(15)};
  flex: 1;
  overflow: scroll;
`;

const Title = styled.h1`
  margin-top: ${sizeCalculator(60)};
  color: #090909;
  font-size: ${sizeCalculator(16)};
  font-style: normal;
  font-weight: 700;
  line-height: ${sizeCalculator(19)};
  margin-bottom: ${sizeCalculator(16)};
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(10)};
  margin-bottom: ${sizeCalculator(24)};
`;

const CategoryTitle = styled.h2`
  color: #000;
  font-size: ${sizeCalculator(12)};
  font-weight: 700;
`;

const CategoryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizeCalculator(16)};
`;
const ItemTitle = styled.h3`
  color: #000;
  font-size: ${sizeCalculator(12)};
  font-weight: 700;
`;
const ItemPrice = styled(ItemTitle)`
  font-weight: 400;
  transition: 0.3s;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  .row {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(2)};
  }
  ${ItemPrice}.active, &:active ${ItemPrice} {
    color: #10a5f7;
  }
`;

const Avatar = styled.img.attrs({
  loading: "lazy",
  alt: "Avatar",
})`
  width: ${sizeCalculator(48)};
  height: ${sizeCalculator(48)};
  object-fit: cover;
  border-radius: ${sizeCalculator(48)};
  margin-right: ${sizeCalculator(8)};
`;

const Decoration = () => {
  const dispatch = useDispatch();
  const { all, my } = useSelector(({ products }) => products);
  const token = useSelector((state) => state?.user?.token);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const getProducts = useCallback(() => {
    setLoading(true);
    request
      .get("api/product/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(setProducts(data?.data));
      })

      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));

    setLoading(true);
    request
      .get("api/product/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(setMyProducts(data?.data));
      })

      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [dispatch, token]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleClick = (id) => {
    const req = () => {
      setIsLoading(id);
      request
        .get(`api/product/wear/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          console.log(data);
          getProducts();
          alert(data?.message);
        })

        .catch((err) => {
          console.error(err);
          alert(err?.response?.data?.message);
        })
        .finally(() => setIsLoading(null));
    };
    const confirm = () => {
      if (window.confirm("Вы уверены, что хотите надеть этот товар?")) {
        req();
      }
    };

    confirm();
  };

  return (
    <Container>
      <Title>Оформление</Title>
      {all?.length === 0 && my?.length === 0 && loading ? (
        "Loading..."
      ) : (
        <>
          {[
            { type: "avatar", name: "Аватар" },
            { type: "card_skin", name: "Рубашка карт" },
            { type: "emoji", name: "Смайлы" },
          ].map((category) => (
            <Category key={category?.type}>
              <CategoryTitle>{category?.name}</CategoryTitle>
              <CategoryItems>
                {all
                  ?.filter(
                    (product) =>
                      my?.find((p) => p?.product_id === product?.id) &&
                      product?.type === category?.type
                  )
                  ?.map((item) => (
                    <Item
                      key={item?.id}
                      onClick={() => {
                        if (
                          !my?.find((p) => p?.product_id === item?.id)
                            ?.is_equipped
                        ) {
                          handleClick(item?.id);
                        }
                      }}
                    >
                      <div className="row">
                        <Avatar src={BASE_URL + item?.image_url} />
                        <ItemTitle>{item?.name}</ItemTitle>
                      </div>
                      <div className="row">
                        <ItemPrice
                          className={
                            my?.find((p) => p?.product_id === item?.id)
                              ?.is_equipped
                              ? "active"
                              : ""
                          }
                        >
                          {isLoading === item?.id
                            ? "Loading..."
                            : my?.find((p) => p?.product_id === item?.id)
                                ?.is_equipped
                            ? "Надет"
                            : "Надеть"}
                        </ItemPrice>
                      </div>
                    </Item>
                  ))}
              </CategoryItems>
            </Category>
          ))}
        </>
      )}
    </Container>
  );
};

export default Decoration;
