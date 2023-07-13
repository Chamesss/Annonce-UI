import React, { useEffect, useState } from 'react';
import { FaAngleDown } from "react-icons/fa";
import './css/Category.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://annonce-backend.azurewebsites.net/category/getall');
      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  function handleSubmit(activeCategoryid, subcategoryid) {
    const queryString = `?keyword=${encodeURIComponent('')}&categoryid=${encodeURIComponent(activeCategoryid)}&subcategoryid=${encodeURIComponent(subcategoryid)}&locationid=${encodeURIComponent('')}`;
    window.location.href = `/search${queryString}`;
  }

  const handleCategoryMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleCategoryMouseLeave = () => {
    setActiveCategory(null);
  };

  const handleCategoryShow = (category) => {
    if (activeCategory !== null) {
      setActiveCategory(null);
      return
    }
    setActiveCategory(category)
  }

  return (
    <div>
      <div className="categories-container">
        <div className="categories-mapping">
          {categories.map((category, index) => (
            <div
              className="category-item"
              style={{ cursor: "pointer" }}
              key={index}
              onMouseEnter={() => handleCategoryMouseEnter(category)}
              onMouseLeave={handleCategoryMouseLeave}
              onClick={() => handleCategoryShow(category)}
            >
              <a href={category.link}>
                <div className="category-single-slot">
                  <p>{category.name}</p>
                  <FaAngleDown/>
                </div>

              </a>
              {activeCategory === category && (
                <ul className="subcategory-list">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li className="subcategory-item" key={subIndex}>
                      <span onClick={() => handleSubmit(activeCategory._id, subcategory._id)} style={{ cursor: "pointer" }} >{subcategory.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;