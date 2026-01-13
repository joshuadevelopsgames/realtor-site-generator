'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ConsultationFormProps {
  variant?: 'default' | 'compact'
}

export default function ConsultationForm({ variant = 'default' }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'buyer' as 'buyer' | 'seller',
    budget: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          type: 'buyer',
          budget: '',
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className={variant === 'compact' ? 'space-y-4' : 'space-y-6'}
    >
      <div className={variant === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-6'}>
        <div>
          <label htmlFor="name" className="block text-label text-black mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-label text-black mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-label text-black mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-label text-black mb-2">
            I am a
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        {variant === 'default' && (
          <div>
            <label htmlFor="budget" className="block text-label text-black mb-2">
              Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
            >
              <option value="">Select range</option>
              <option value="under-5m">Under $5M</option>
              <option value="5m-10m">$5M - $10M</option>
              <option value="10m-20m">$10M - $20M</option>
              <option value="20m-plus">$20M+</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-label text-black mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={variant === 'compact' ? 4 : 6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      {submitStatus === 'success' && (
        <p className="text-sm text-black/70">Thank you. Your message has been received.</p>
      )}

      {submitStatus === 'error' && (
        <p className="text-sm text-red-600">There was an error submitting your message. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </motion.form>
  )
}
