import React from 'react'
import styles from './categoryList.module.css'
import Link from 'next/link';
import Image from 'next/image';

const CategoryList = () => {
  return (
    <div className = {styles.container}>
      <h1 className={styles.title}>Popular  Categories</h1>
      <div className={styles.categories}>
        <Link href="/blogMC?cat=wellbeing" className={`${styles.category} ${styles.wellbeing}`}>
          <Image
            src="/TeenTherapy.png" 
            alt="Category Image 1" 
            height={32} width={32}
            className={styles.image} 
          />
          Wellbeing
        </Link>

        <Link href="/blogMC?cat=mindfulness" className={`${styles.category} ${styles.mindfulness}`}>
          <Image 
            src="/TeenTherapy.png" 
            alt="Category Image 1" 
            width={32} height={32} 
            className={styles.image}
          />
          Mindfulness
        </Link>

        <Link href="/blogMC?cat=self-Care" className={`${styles.category} ${styles.selfCare}`}>
          <Image 
            src="/TeenTherapy.png" 
            alt="" 
            width={32} height={32} 
            className={styles.image} 
          />
          Self-Care
        </Link>

        <Link href="/blogMC?cat=relationships" className={`${styles.category} ${styles.relationships}`}>
          <Image 
            src="/TeenTherapy.png" 
            alt="Category Image 1" 
            width={32} height={32} 
            className={styles.image} 
          />
          Relationships
        </Link>

        <Link href="/blogMC?cat=therapy" className={`${styles.category} ${styles.therapy}`}>
          <Image 
            src="/TeenTherapy.png" 
            alt="Category Image 1" 
            width={32} height={32} 
            className={styles.image} 
          />
          Therapy
        </Link>

        <Link href="/blogMC?cat=others" className={`${styles.category} ${styles.others}`}>
          <Image 
            src="/TeenTherapy.png" 
            alt="Category Image 1" 
            width={32} height={32} 
            className={styles.image} 
          />
          Others
        </Link>
      </div>
    </div>
  )
}

export default CategoryList
