import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";
import { MyContext } from "../../router";

export default function CategoryCollapse() {
  const context = useContext(MyContext);

  const [menuIndex, setMenuIndex] = useState(null);
  const [innerMenu, setInnerMenu] = useState({});

  const openMenu = (index) => {
    setMenuIndex(menuIndex === index ? null : index);
  };

  const openInnerMenu = (key) => {
    setInnerMenu((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ✅ maintenant on utilise directement les données du backend
  const parentCats = context.catData || [];

  return (
    <div className="w-[95%] !mx-auto scroll">
      <ul className="w-full">
        {parentCats.map((cat, index) => {
          const subCats = cat.children || [];

          return (
            <li
              key={cat._id}
              className="list-none flex items-center relative flex-col w-full !capitalize"
            >
              <Link
                to={`/listeProduits?category=${cat._id}&name=${cat.name}`}
                className="w-full"
              >
                <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !text-black !capitalize">
                  {cat.name}
                </Button>
              </Link>

              {/* ✅ icône parent */}
              {subCats.length > 0 && (
                <span className="absolute top-[8px] right-[15px] cursor-pointer z-10">
                  {menuIndex === index ? (
                    <FaRegSquareMinus
                      onClick={(e) => {
                        e.stopPropagation();
                        openMenu(index);
                      }}
                    />
                  ) : (
                    <FaRegSquarePlus
                      onClick={(e) => {
                        e.stopPropagation();
                        openMenu(index);
                      }}
                    />
                  )}
                </span>
              )}

              {/* ✅ sous-catégories */}
              {menuIndex === index && subCats.length > 0 && (
                <ul className="w-full pl-3">
                  {subCats.map((subCat, subIndex) => {
                    const subSubCats = subCat.children || [];
                    const key = `${index}-${subIndex}`;

                    return (
                      <li key={subCat._id} className="relative">
                        <Link
                          to={`/listeProduits?category=${subCat._id}&name=${subCat.name}`}
                          className="w-full"
                        >
                          <Button className="w-full !justify-start !px-6 !text-black !capitalize">
                            {subCat.name}
                          </Button>
                        </Link>

                        {/* ✅ icône sous-catégorie */}
                        {subSubCats.length > 0 && (
                          <span className="absolute top-[8px] right-[15px] cursor-pointer z-10">
                            {innerMenu[key] ? (
                              <FaRegSquareMinus
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInnerMenu(key);
                                }}
                              />
                            ) : (
                              <FaRegSquarePlus
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInnerMenu(key);
                                }}
                              />
                            )}
                          </span>
                        )}

                        {/* ✅ sous-sous-catégories */}
                        {innerMenu[key] && subSubCats.length > 0 && (
                          <ul className="w-full pl-3">
                            {subSubCats.map((subSubCat) => (
                              <li key={subSubCat._id}>
                                <Link
                                  to={`/listeProduits?category=${subSubCat._id}&name=${subSubCat.name}`}
                                  className="w-full"
                                >
                                  <Button className="w-full !justify-start !px-9 !text-black !capitalize">
                                    {subSubCat.name}
                                  </Button>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}