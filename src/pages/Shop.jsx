import styled from "styled-components";
import sizeCalculator from "../hook/useSizeCalculator";
import dollar from "../assets/images/dollar.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { request } from "../service/api";
import { setProducts } from "../redux/productsSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../service/constants";

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

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${sizeCalculator([5, 15, 5, 5])};
  cursor: pointer;
  border-radius: ${sizeCalculator(10)};
  transition: 0.3s;
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
  .row {
    display: flex;
    align-items: center;
    gap: ${sizeCalculator(2)};
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

const ItemTitle = styled.h3`
  color: #000;
  font-size: ${sizeCalculator(12)};
  font-weight: 700;
`;

const ItemPrice = styled(ItemTitle)`
  font-weight: 400;
`;

const DollarIcon = styled.img.attrs(() => ({
  src: dollar,
  alt: "Dollar Icon",
  loading: "lazy",
}))`
  width: ${sizeCalculator(19)};
  height: ${sizeCalculator(19)};
  filter: invert(1);
  object-fit: contain;
`;

const Shop = () => {
  const dispatch = useDispatch();
  const { all } = useSelector(({ products }) => products);
  const token = useSelector((state) => state?.user?.token);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  const handleClick = (id) => {
    const req = () => {
      setIsLoading(id);
      request
        .get(`api/product/buy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          console.log(data);
          alert(data?.message);
        })

        .catch((err) => {
          console.error(err);
          alert(err?.response?.data?.message);
        })
        .finally(() => setIsLoading(null));
    };
    const confirm = () => {
      if (window.confirm("Вы уверены, что хотите купить этот товар?")) {
        req();
      }
    };
    confirm();
  };

  useEffect(() => {
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
  }, [dispatch, token]);

  return (
    <Container>
      <Title>Магазин</Title>
      {all?.length === 0 && loading ? (
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
                  ?.filter((product) => product?.type === category?.type)
                  ?.map((item) => (
                    <Item key={item?.id} onClick={() => handleClick(item?.id)}>
                      <div className="row">
                        <Avatar src={BASE_URL + item?.image_url} />
                        <ItemTitle>{item?.name}</ItemTitle>
                      </div>

                      <div className="row">
                        <DollarIcon />
                        <ItemPrice>
                          {isLoading === item?.id ? "Loading..." : item?.price}
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

export default Shop;
