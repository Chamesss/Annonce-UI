import React, { useEffect, useState } from 'react';
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

  return (
    <div>
    <div className="categories">
      <div className="categories-container">
        {categories.map((category, index) => (
          <div
            className="category-item"
            style={{cursor:"pointer"}}
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
                    <span onClick={() => handleSubmit(activeCategory._id, subcategory._id)} style={{cursor:"pointer"}} >{subcategory.name}</span>
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