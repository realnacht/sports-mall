import {
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FlexProps,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { FlexNavItem } from "./FlexNavItem";
import { IoMdCart, IoMdHome, IoMdList, IoMdPerson } from "react-icons/io";
import React, { useEffect, useState } from "react";
import NavLink from "next/link";
import { DrawerHeader } from "@chakra-ui/core/dist";
import { fetcher } from "../../utils";
import { useInterval } from "../../hooks/useInterval";

const allCategoriesQuery = `
{
  allCategories{
  data{
    _id
    name
  }
}
}
`;

type AllCategoriesResult = {
  allCategories: {
    data: Array<{
      _id: string;
      name: string;
    }>;
  };
};

const NavLinkButton: React.FC<ButtonProps> = (props) => (
  <Button variant="link" color="white" {...props} />
);

//I use NavMenu on Header for tablet and desktop, on Footer for mobile
export const NavMenu: React.FC<FlexProps> = (props) => {
  const [amount, setAmount] = useState(0);
  useInterval(() => {
    const cart = localStorage.getItem("cart");
    if (cart == null) {
      setAmount(0);
    } else {
      const cartArray = JSON.parse(cart);
      let total = 0;
      cartArray.forEach((e: { quantity: number; price: number }) => {
        total += e.price * 100 * e.quantity;
      });
      setAmount(total / 100);
    }
  }, 200);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState(
    [] as Array<{
      _id: string;
      name: string;
    }>
  );
  useEffect(() => {
    fetcher<AllCategoriesResult>(allCategoriesQuery).then((data) =>
      setCategories(data.allCategories.data)
    );
  }, []);
  let categoriesLines: Array<JSX.Element> = [];
  if (categories.length >= 1) {
    categoriesLines = categories.map((category) => (
      <Flex key={category._id} padding="0.5rem">
        <NavLink href={`/categories/${category._id}`}>
          <Link _hover={{ color: "primary.500" }}>
            <Text fontSize="2xl">{category.name}</Text>
          </Link>
        </NavLink>
      </Flex>
    ));
  }

  return (
    <Flex
      {...props}
      as="nav"
      bg="black"
      width="full"
      justifyContent="space-around"
    >
      <FlexNavItem display={["block", "block", "none"]}>
        <NavLink href={"/index"} as={"/"}>
          <Link>
            <NavLinkButton leftIcon={IoMdHome}>首页</NavLinkButton>
          </Link>
        </NavLink>
      </FlexNavItem>

      <FlexNavItem>
        <NavLinkButton leftIcon={IoMdList} onClick={onOpen}>
          分类
        </NavLinkButton>
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <Text fontSize="3xl">商品分类</Text>
            </DrawerHeader>
            <DrawerBody>{categoriesLines}</DrawerBody>
          </DrawerContent>
        </Drawer>
      </FlexNavItem>

      <FlexNavItem width="10rem">
        <NavLinkButton leftIcon={IoMdCart}>{amount} ￥</NavLinkButton>
      </FlexNavItem>

      <FlexNavItem>
        <NavLinkButton leftIcon={IoMdPerson}>账户</NavLinkButton>
      </FlexNavItem>
    </Flex>
  );
};
