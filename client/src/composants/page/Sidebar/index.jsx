import React, { useState, useContext, useEffect } from "react";
import "./index.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Collapse } from "react-collapse";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../../router";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Sidebar({ filterByPrice, filterByRating, categoryId }) {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);

  const [priceValue, setPriceValue] = useState([0, 1000000]);

  // Catégories parentes uniquement
  const parentCats = context.catData?.filter((cat) => !cat.parentId) || [];

  // Sous-catégories de la catégorie sélectionnée
  const selectedCatId = searchParams.get("category");
  const subCats = context.catData?.filter(
    (cat) => cat.parentId?.toString() === selectedCatId
  ) || [];

  const handlePriceChange = (values) => {
    setPriceValue(values);
  };

  const applyPriceFilter = () => {
    if (filterByPrice) {
      filterByPrice(priceValue[0], priceValue[1]);
    }
  };

  const handleRatingFilter = (rating) => {
    if (filterByRating) {
      filterByRating(rating);
    }
  };

  return (
    <aside className="sidebar !py-5">
      {/* Filtre par catégorie */}
      <div className="box">
        <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
          Achat par Catégorie
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            {parentCats.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox
                    size="small"
                    checked={searchParams.get("category") === cat._id}
                    onChange={() =>
                      navigate(`/listeProduits?category=${cat._id}&name=${cat.name}`)
                    }
                  />
                }
                label={cat.name}
                className="w-full"
              />
            ))}
          </div>
        </Collapse>
      </div>

      {/* Sous-catégories si catégorie sélectionnée */}
      {subCats.length > 0 && (
        <div className="box !mt-2">
          <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
            Sous-catégories
          </h3>
          <div className="scroll !px-4 relative -left-[13px]">
            {subCats.map((sub) => (
              <FormControlLabel
                key={sub._id}
                control={
                  <Checkbox
                    size="small"
                    checked={searchParams.get("category") === sub._id}
                    onChange={() =>
                      navigate(`/listeProduits?category=${sub._id}&name=${sub.name}`)
                    }
                  />
                }
                label={sub.name}
                className="w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* Disponibilité */}
      <div className="box">
        <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
          Disponibilité
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}
          >
            {isOpenAvailFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenAvailFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            <FormControlLabel control={<Checkbox size="small" />} label="Disponible" className="w-full" />
            <FormControlLabel control={<Checkbox size="small" />} label="En stock" className="w-full" />
            <FormControlLabel control={<Checkbox size="small" />} label="Indisponible" className="w-full" />
          </div>
        </Collapse>
      </div>

      {/* Taille */}
      <div className="box !mt-3">
        <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
          Taille
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {isOpenSizeFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenSizeFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
              <FormControlLabel
                key={size}
                control={<Checkbox size="small" />}
                label={size}
                className="w-full"
              />
            ))}
          </div>
        </Collapse>
      </div>

      {/* Filtre par prix */}
      <div className="box !mt-4">
        <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
          Filtrer Par Prix
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
          >
            {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenPriceFilter}>
          <RangeSlider
            min={0}
            max={1000000}
            step={1000}
            value={priceValue}
            onInput={handlePriceChange}
          />
          <div className="flex !pt-4 !pb-2 priceRange">
            <span className="!text-[13px]">
              De: <strong>{priceValue[0].toLocaleString()} Fcfa</strong>
            </span>
            <span className="!ml-auto !text-[13px]">
              À: <strong>{priceValue[1].toLocaleString()} Fcfa</strong>
            </span>
          </div>
          <Button
            className="btn-org w-full !mt-2 !text-[12px]"
            onClick={applyPriceFilter}
          >
            Appliquer
          </Button>
        </Collapse>
      </div>

      {/* Filtre par note */}
      <div className="box !mt-4">
        <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
          Filtrer Par Notes
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            {isOpenRatingFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenRatingFilter}>
          {[5, 4, 3, 2, 1].map((star) => (
            <div
              key={star}
              className="w-full cursor-pointer hover:bg-[#f1f1f1] rounded-md !px-2 !py-1"
              onClick={() => handleRatingFilter(star)}
            >
              <Rating name={`rating-${star}`} defaultValue={star} size="small" readOnly />
            </div>
          ))}
        </Collapse>
      </div>
    </aside>
  );
}

{/*import React,{useContext, useState} from "react"
import "./index.css";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Collapse} from 'react-collapse';
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from "@mui/material/Rating";
import { MyContext } from "../../../router";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Sidebar(){
    const context=useContext(MyContext);
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();
    const [isOpenCategoryFilter,setIsOpenCategoryFilter]=useState(true);
    const [isOpenAvailFilter,setIsOpenAvailFilter]=useState(true);
    const [isOpenSizeFilter,setIsOpenSizeFilter]=useState(true);
   return(
    <aside className="sidebar !py-5">
        <div className="box">
            <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5"> Achat par Categorie
                 <Button className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]" 
                  onClick={()=>setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
                    {
                     isOpenCategoryFilter===true ? <FaAngleUp /> : <FaAngleDown />
                    }
                    </Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter}>
  <div className="scroll !px-4 relative -left-[13px]">
    {context.catData?.filter(cat => !cat.parentId).map((cat) => (
      <FormControlLabel
        key={cat._id}
        control={
          <Checkbox
            size="small"
            checked={searchParams.get("category") === cat._id}
            onChange={() => navigate(`/listeProduits?category=${cat._id}&name=${cat.name}`)}
          />
        }
        label={cat.name}
        className="w-full"
      />
    ))}
  </div>
</Collapse>
                
        </div>
        <div className="box">
            <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">Disponibilité
                 <Button className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]" 
                  onClick={()=>setIsOpenAvailFilter(!isOpenAvailFilter)}>
                    {
                     isOpenAvailFilter===true ? <FaAngleUp /> : <FaAngleDown />
                    }
                    </Button>
                </h3>
            <Collapse isOpened={isOpenAvailFilter}>
              <div className="scroll !px-4 relative -left-[13px]">
                 <FormControlLabel control={<Checkbox size="small" />} label="Disponible (12)" className="w-full"/>
                 <FormControlLabel control={<Checkbox size="small"/>} label="En stock (11)" className="w-full"/>
                 <FormControlLabel control={<Checkbox size="small"/>} label="Indisponible (12)" className="w-full"/>
              </div>
            </Collapse>
        </div>
        <div className="box !mt-3">
            <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">Taille
                 <Button className="!w-[30px] !h-[30px] !min-w-[30px] rounded-full !ml-auto !text-[#000]" 
                  onClick={()=>setIsOpenSizeFilter(!isOpenSizeFilter)}>
                    {
                     isOpenSizeFilter===true ? <FaAngleUp /> : <FaAngleDown />
                    }
                    </Button>
                </h3>
            <Collapse isOpened={isOpenSizeFilter}>
              <div className="scroll !px-4 relative -left-[13px]">
                 <FormControlLabel control={<Checkbox size="small" />} label="S (12)" className="w-full"/>
                 <FormControlLabel control={<Checkbox size="small"/>} label="M (12)" className="w-full"/>
                 <FormControlLabel control={<Checkbox size="small"/>} label="L (12)" className="w-full"/>
                  <FormControlLabel control={<Checkbox size="small"/>} label="XL (12)" className="w-full"/>
                   <FormControlLabel control={<Checkbox size="small"/>} label="2XL (12)" className="w-full"/>
                    <FormControlLabel control={<Checkbox size="small"/>} label="3XL (12)" className="w-full"/>
              </div>
            </Collapse>
        </div>
        <div className="box !mt-4">
            <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
                Filtrer Par Prix
            </h3>
            <RangeSlider />
            <div className="flex !pt-4 !pb-2 priceRange">
              <span className="!text-[13px]">
                De:<strong className="text-dark">{1000} Fcfa</strong>
              </span>
               <span className="!ml-auto !text-[13px]">
                Á:<strong className="text-dark">{100000} Fcfa</strong>
              </span>
            </div>
        </div>
        <div className="box !mt-4">
            <h3 className="!w-full !mb-3 !text-[16px] font-[600] flex items-center !pr-5">
                Filtrer Par Notes
            </h3>
            <div className="w-full">
                 <Rating name="size-small" defaultValue={5} size="small" readOnly/>
            </div>
            <div className="w-full">
                 <Rating name="size-small" defaultValue={4} size="small" readOnly/>
            </div>
            <div className="w-full">
                 <Rating name="size-small" defaultValue={3} size="small" readOnly/>
            </div>
            <div className="w-full">
                 <Rating name="size-small" defaultValue={2} size="small" readOnly/>
            </div>
            <div className="w-full">
                 <Rating name="size-small" defaultValue={1} size="small" readOnly/>
            </div>
        </div>
    </aside>
   )
}*/}