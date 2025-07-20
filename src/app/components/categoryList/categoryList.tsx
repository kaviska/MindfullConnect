"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import styles from "./categoryList.module.css";
import Link from "next/link";
import Image from "next/image";

const CategoryList = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("cat");

  const categories = [
    {
      name: "All Blogs",
      href: "/blogMC",
      param: null,
      image: "/globe.svg",
      className: "allBlogs",
    },
    {
      name: "Wellbeing",
      href: "/blogMC?cat=wellbeing",
      param: "wellbeing",
      image: "/images/categories/wellbeing-cover.jpg",
      className: "wellbeing",
    },
    {
      name: "Mindfulness",
      href: "/blogMC?cat=mindfulness",
      param: "mindfulness",
      image: "/images/categories/mindfulness-cover.jpg",
      className: "mindfulness",
    },
    {
      name: "Self-Care",
      href: "/blogMC?cat=self-care",
      param: "self-care",
      image: "/images/categories/self-care-cover.jpg",
      className: "selfCare",
    },
    {
      name: "Relationships",
      href: "/blogMC?cat=relationships",
      param: "relationships",
      image: "/images/categories/relationships-cover.jpg",
      className: "relationships",
    },
    {
      name: "Therapy",
      href: "/blogMC?cat=therapy",
      param: "therapy",
      image: "/images/categories/therapy-cover.jpg",
      className: "therapy",
    },
    {
      name: "Other",
      href: "/blogMC?cat=other",
      param: "other",
      image: "/images/categories/default-cover.jpg",
      className: "others",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Filter through Categories</h1>
      <div className={styles.categories}>
        {categories.map((category) => {
          const isActive =
            currentCategory === category.param ||
            (currentCategory === null && category.param === null);
          return (
            <Link
              key={category.name}
              href={category.href}
              className={`${styles.category} ${styles[category.className]} ${isActive ? styles.active : ""}`}
            >
              <Image
                src={category.image}
                alt={`${category.name} Category`}
                height={32}
                width={32}
                className={styles.image}
              />
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
