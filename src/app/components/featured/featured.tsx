import React from 'react'
import styles from './featured.module.css'
import Image from 'next/image'

const Featured = () => {
  return (
    <div className={styles.container}>

      <h4 className={styles.title}><b>MindfulConnect  ❤️‍🩹<br/>Bloggit Reading Corner</b></h4> 
      
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src={"/p1.jpeg"} alt="Featured Image 1" fill className={styles.image} />
        </div>
        <div className={styles.txtContainer}>
          <h2 className={styles.postTitle}>Lorem ipsum dolor, sit amet consectetur elit.</h2>

          <p className= {styles.postDesc}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus omnis quae minus laboriosam temporibus, ipsam aperiam! Ducimus nesciunt harum tempore est, reprehenderit asperiores maiores ipsum at, quas odit ratione sunt. Lorem ipsum dolor sit.</p>

          <button className={styles.button}>Read More</button>

          </div>
      </div>
    </div>
  )
}

export default Featured;
