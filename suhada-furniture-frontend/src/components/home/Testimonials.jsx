import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
  {
    id: 1,
    name: 'Bob and Kelly',
    location: 'USA, Florida',
    avatar: 'https://i.pravatar.cc/150?img=1',
    review: "Suhada was fantastic to work with. Ordering furniture through Suhada was way more affordable than buying locally. In addition to saving money, we were able to get things exactly the scale that we wanted. I highly recommend and have already told our friends about it!",
  },
  {
    id: 2,
    name: 'Christoph',
    location: 'Germany, Stuttgart',
    avatar: 'https://i.pravatar.cc/150?img=2',
    review: "Honestly, I didn't expect that ordering furniture from China would be such an easy and quick process. The Suhada team took care of logistics and customs arrangements, and the managers helped me choose the furniture and finishing materials. The cargo was delivered to my home in just a couple of weeks in perfect condition. I'm very glad that I decided to cooperate with your company!",
  },
  {
    id: 3,
    name: 'Sofia',
    location: 'Buenos Aires, Argentina',
    avatar: 'https://i.pravatar.cc/150?img=3',
    review: "It is very important for me to be able to see and touch furniture in person before I buy it. That is why we decided to travel with our family to choose furniture for the renovation of our villa. We were very pleased that we were able to put together a complete set of furniture for all the main rooms in just a few days: bedroom, children's room, kitchen, and living room.",
  },
];



  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            3 out of 4 clients recommend Suhada to their friends
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Watch all video reviews on our <span className="text-gold-600 hover:underline cursor-pointer">YouTube channel</span>
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex"
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12"
    >
      <div className="flex items-start gap-6 mb-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-bold mb-1">{testimonial.name}</h3>
          <p className="text-gray-500 dark:text-gray-400">{testimonial.location}</p>
        </div>
      </div>
      
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {testimonial.review}
      </p>
    </motion.div>
  );
};

export default Testimonials;