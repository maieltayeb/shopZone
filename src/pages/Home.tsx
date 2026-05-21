import React from 'react'
import { Link } from 'react-router-dom'
import { FaMobileAlt, FaGem, FaTshirt, FaTruck, FaReply, FaLock, FaComments, FaShoppingBag } from 'react-icons/fa'
import { subscribeToNewsletter } from '../services/newsletter.service'

export default function Home() {
  const categories = [
    { id: 1, name: 'Electronics', categoryKey: 'electronics', icon: FaMobileAlt, color: 'from-blue-400 to-blue-600' },
    { id: 2, name: 'Jewelery', categoryKey: 'jewelery', icon: FaGem, color: 'from-pink-400 to-pink-600' },
    { id: 3, name: "Men's Clothing", categoryKey: "men's clothing", icon: FaTshirt, color: 'from-gray-400 to-gray-600' },
    { id: 4, name: "Women's Clothing", categoryKey: "women's clothing", icon: FaTshirt, color: 'from-purple-400 to-purple-600' },
  ]

  const features = [
    { id: 1, title: 'Free Shipping', description: 'On orders over $50', icon: FaTruck },
    { id: 2, title: 'Easy Returns', description: '30-day return policy', icon: FaReply },
    { id: 3, title: 'Secure Payment', description: '100% secure checkout', icon: FaLock },
    { id: 4, title: '24/7 Support', description: 'Customer support anytime', icon: FaComments },
  ]

  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [messageType, setMessageType] = React.useState<'success' | 'error'>('success')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const result = await subscribeToNewsletter(email)
    setMessageType(result.success ? 'success' : 'error')
    setMessage(result.message)
    
    if (result.success) {
      setEmail('')
      setTimeout(() => setMessage(''), 5000)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fadeInLeft">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Ultimate Shopping Destination
              </h1>
              <p className="text-xl text-blue-100">
                Discover millions of products at unbeatable prices. Shop smarter, save more.
              </p>
              <div className="flex gap-4 pt-4">
                <Link 
                  to="/products" 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/products" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 flex items-center justify-center h-full animate-bounce" style={{ animationDelay: '0s' }}>
                  <div className="text-9xl text-white"><FaShoppingBag /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              const colors = [
                'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
                'from-green-50 to-green-100 border-green-200 text-green-600',
                'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
                'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
              ]
              const color = colors[index]
              
              return (
                <div 
                  key={feature.id}
                  className={`bg-gradient-to-br ${color} border rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 inline-block p-4 bg-white rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="text-5xl"><IconComponent /></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 animate-fadeInDown">
            Shop by Category
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.categoryKey}`}
                  className={`group bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white transform transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-fadeInUp`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:translate-x-2 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-white opacity-80 mt-2 group-hover:opacity-100 transition-opacity">
                        Explore Now →
                      </p>
                    </div>
                    <div className="text-6xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      <IconComponent />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
          <h2 className="text-4xl font-bold mb-6">Special Offer This Week</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get up to 40% off on selected items. Limited time offer!
          </p>
          <div className="inline-block">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Claim Offer Now
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Stay Updated
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Subscribe to our newsletter and get exclusive deals and updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              
              {message && (
                <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                  messageType === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10M+', label: 'Products' },
            { number: '50M+', label: 'Happy Customers' },
            { number: '195+', label: 'Countries' },
            { number: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-4xl font-bold mb-2 group hover:scale-110 transition-transform duration-300 cursor-default">
                {stat.number}
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  )
}
