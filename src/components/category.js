import React, { useEffect, useState } from 'react';
import './css/Category.css';
import { useNavigate } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/category/getall');
      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  function handleSubmit(activeCategoryid, subcategoryid) {
    const queryString = `?keyword=${encodeURIComponent('')}&categoryId=${encodeURIComponent(activeCategoryid)}&subcategoryId=${encodeURIComponent(subcategoryid)}&locationId=${encodeURIComponent('')}`;
    Navigate(`/search${queryString}`);
  }



  const handleCategoryMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleCategoryMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div>
    <div className="categories">
      <div className="categories-container">
        {categories.map((category, index) => (
          <div
            className="category-item"
            key={index}
            onMouseEnter={() => handleCategoryMouseEnter(category)}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <a href={category.link}>
              <div className="category-icon">
                <img src={category.picture} alt={category.name} />
              </div>
              <h3>{category.name}</h3>
              <span className="dropdown-arrow"></span>
            </a>
            {activeCategory === category && (
              <ul className="subcategory-list">
                {category.subcategories.map((subcategory, subIndex) => (
                  <li className="subcategory-item" key={subIndex}>
                    <span onClick={() => handleSubmit(activeCategory._id, subcategory._id)}>{subcategory.name}</span>
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