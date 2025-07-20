import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'

const Featured = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>
          <span className={styles.brandName}>MindfulConnect</span>
          <span className={styles.subtitle}>Your Journey to Wellness Starts Here</span>
        </h1>
        <p className={styles.description}>
          Discover insights, stories, and resources to support your mental health journey
        </p>
      </div>
      
      <div className={styles.featuredPost}>
        <div className={styles.postCard}>
          <div className={styles.imgContainer}>
            <Image 
              src={"/p1.jpeg"} 
              alt="A serene moment of reflection and peace" 
              fill 
              className={styles.image} 
              priority
            />
            <div className={styles.imageOverlay}></div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.postMeta}>
              <span className={styles.category}>MindfulConnect</span>
              <span className={styles.readTime}>Reading Corner</span>
            </div>
            <h2 className={styles.postTitle}>
              Finding Peace in Daily Moments: A Guide to Mindful Living
            </h2>
            <p className={styles.postDesc}>
              Discover simple yet powerful techniques to bring mindfulness into your everyday life. 
              Learn how small moments of awareness can create lasting positive changes in your mental well-being 
              and help you navigate life's challenges with greater clarity and peace.
            </p>
            <div className={styles.actionContainer}>
              <button className={styles.readButton}>
                <span>Continue Reading</span>
                <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured;
