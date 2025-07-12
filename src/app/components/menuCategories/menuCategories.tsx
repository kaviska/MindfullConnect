import Link from "next/link";
import React from "react";
import styles from "./menuCategories.module.css";

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
      <Link
        href="/blog?cat=wellbeing"
        className={`${styles.categoryItem} ${styles.wellbeing}`}
      >
        Wellbeing
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.mindfulness}`}>
        Mindfulness
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.selfCare}`}>
        Self-Care
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.relationships}`}>
        Relationships
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.therapy}`}>
        Therapy
      </Link>
      <Link href="/blog" className={`${styles.categoryItem} ${styles.others}`}>
        Others
      </Link>
    </div>
  );
};

export default MenuCategories;