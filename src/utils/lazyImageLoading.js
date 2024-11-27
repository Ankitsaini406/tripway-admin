import Image from "next/image";
import React, { useEffect, useRef } from "react";

function LazyLoadImage({ className, src, alt, imageLength }) {

    const imageRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entery) => {
                    if (entery.isIntersecting) {
                        const img = entery.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            },
            { threshold: 0.1 }
        );

        imageRefs.current.forEach((img) => {
            if (img) observer.observe(img);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Image
                className={className}
                data-src={src}
                src={src}
                alt={alt}
                width='200'
                height='200'
                ref={(el) => (imageRefs.current[imageLength] = el)}
                loading="lazy" />
        </>
    )
}

export default LazyLoadImage;
