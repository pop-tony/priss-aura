import { motion,AnimatePresence } from 'framer-motion'
import { format, addDays } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle2, Clock, CreditCard, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { timeSlots } from '../data/dishes';
import { toast } from 'sonner';
import axios from 'axios';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export const Reservation = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [step, setStep] = useState('details') // 'details' | 'payment' | 'success'
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: 2 });
    const [orderRef, setOrderRef] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [toPay, setToPay] = useState(0);

    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

    const key = import.meta.env.VITE_PAYSTACK_LIVE_PUBLIC_KEY;
    const backendUrl = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BACKEND_URL : "/api";

    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && closeModal()
        if (isModalOpen) {
          document.body.style.overflow = 'hidden'
          window.addEventListener('keydown', handleEsc)
        } else {
          document.body.style.overflow = 'unset'
        }
        return () => {
          document.body.style.overflow = 'unset'
          window.removeEventListener('keydown', handleEsc)
        }
    }, [isModalOpen])

    useEffect(()=>{
        const amount = 100 * Number(formData.guests) - (100 * Number(formData.guests) * 0.1);
        setToPay(amount)
    }, [formData])
    
    const closeModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
          setStep('details')
          setOrderRef('')
        }, 300)
    }

    const handlePaymentSuccess = async (response) => {
  
        try {
          toast.success(`Booked! Ref: `);
          
          await createBooking();
          
        } catch (err) {
          toast.error('Payment succeeded but order save failed');
          console.error(err);
        }
      }
    
      const handlePaymentClose = () => {
        toast.info('Payment window closed');
      };
    
      const handlePay = () => {
        if (!formData.name ||!formData.email ||!formData.phone) {
          toast.error('Fill all fields');
          return;
        }
        if (!formData.date ||!formData.time) {
          toast.error('Pick date, time');
          return;
        }
    
        try {
            const handler = window.PaystackPop.setup({
                key: key,
                email: formData.email,
                amount: Math.round(toPay),
                currency: 'GHS',
                ref: `FADE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
                metadata: {
                  custom_fields: [
                    { display_name: "Service", variable_name: "service", value: 'Reservation' },
                    { display_name: "Date", variable_name: "date", value: formData.date },
                    { display_name: "Time", variable_name: "time", value: formData.time }
                  ]
                },
                callback: (response)=>handlePaymentSuccess(response),
                onClose: () => handlePaymentClose,
              });
              handler.openIframe();
        } catch (error) {
            console.error(error)
        }
      };
    
      const createBooking = async () => {
    
        try {
          const book = await axios.post(`${backendUrl}/order/consult`, {formData});
    
          if (book.data.success) {
            toast.success("Order placed successfully!");
            setStep('success');
            clearCart();
          }else{
            toast.error("Order saved locally. Contact support with ref: ");
            console.log(book.data)
          }
        } catch (err) {
            toast.error("Order saved locally. Contact support with ref: ");
          console.error(err);
        }
      };

    
    const updateField = (field, value) => {
        setFormData(prev => ({...prev, [field]: value }))
    }

  return (
    <div id='reserve'>

        <div className="flex justify-center mt-3 bg-zinc-100 px-4 py-20 text-zinc-900 dark:bg-zinc-900 dark:text-white">
            <p 
              variants={fadeUp}
              onClick={() => setIsModalOpen(true)} 
              className="cursor-pointer inline-flex items-center gap-2 rounded-full border-2 border-amber-500 px-8 py-3 font-semibold text-amber-500 transition hover:bg-amber-500 hover:text-black">
                Book Reservation
            </p>
        </div>
        {/* Modal */}
        <AnimatePresence >
            {isModalOpen && (
            <>
                <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ duration: 0.3 }}
                onClick={closeModal}
                className='fixed inset-0 z-50 bg-black/70'
                />

                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    onClick={(e) => e.stopPropagation()}
                    className='w-full max-w-lg p-5'
                >
                    <div className='max-h- overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900'>

                    {/* Step 1: Details */}
                    {step === 'details' && (
                        <div className='p-6 sm:p-8'>
                        <div className='flex items-start justify-between gap-3'>
                            <div>
                            <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                                Reserve your spot
                            </h3>
                            <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                                GHS 100 per person
                            </p>
                            </div>
                            <button
                            onClick={closeModal}
                            className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 hover:rotate-90 transition dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                            >
                            <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={()=>setStep('datetime')} className='mt-6 space-y-4'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                    Full Name
                                </label>
                                <input
                                    type='text'
                                    required
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                    placeholder='Enter your name'
                                />
                                </div>

                                <div>
                                <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    required
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                    placeholder='your@email.com'
                                />
                                </div>

                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                    Phone
                                    </label>
                                    <input
                                    type='tel'
                                    required
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                    placeholder='+233...'
                                    />
                                </div>
                                <div className='text-black dark:text-white'>
                                    Number of Guests
                                    <select
                                        className="rounded-lg bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800"
                                        onChange={e => updateField('guests', e.target.value)}
                                        value={formData.guests}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                            type='submit'
                            className='cursor-pointer mt-2 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                            >
                            Choose date
                            </button>
                        </form>
                        </div>
                    )}

                    {step === 'datetime' && (
                        <form onSubmit={handlePay} className='mt-6 space-y-4'>
                            <div className="space-y-6 p-5">
                                <div>
                                <h4 className="mb-3 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                                    <Calendar className="h-5 w-5" /> Select Date
                                </h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {next7Days.map(date => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    return (
                                        <button
                                        key={dateStr}
                                        type="button"
                                        onClick={() => updateField('date', dateStr)}
                                        className={`rounded-xl border-2 p-3 text-center transition ${
                                            formData.date === dateStr
                                            ? 'border-amber-500 bg-amber-500 text-white'
                                            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-800'
                                        }`}
                                        >
                                        <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                                        <div className="text-lg font-bold">{format(date, 'd')}</div>
                                        </button>
                                    );
                                    })}
                                </div>
                                </div>

                                {formData.date && (
                                <div>
                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                                    <Clock className="h-5 w-5" /> Select Time
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map(time => (
                                        <button
                                        key={time}
                                        type="button"
                                        onClick={() => updateField('time', time)}
                                        className={`rounded-xl border-2 p-3 text-sm font-medium transition ${
                                            formData.time === time
                                            ? 'border-amber-500 bg-amber-500 text-white'
                                            : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-800'
                                        }`}
                                        >
                                        {time}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                                )}

                                
                                <button
                                    type="submit"
                                    onClick={() => {setStep('payment')}}
                                    className="cursor-pointer w-full rounded-full bg-zinc-900 py-4 font-semibold text-white hover:bg-amber-500 dark:bg-white dark:text-black"
                                >
                                    Continue to Payment
                                </button>
                                
                            </div>
                        </form>
                    )}

                    {/* Step 2: Payment */}
                    {step === 'payment' && (
                        <div className='p-6 sm:p-8'>
                        <div className='flex items-start justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                            <button
                                onClick={() => setStep('details')}
                                disabled={isProcessing}
                                className='-ml-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                            >
                                <ArrowLeft className='h-5 w-5' />
                            </button>
                            <div>
                                <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                                Checkout
                                </h3>
                                <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                                Pay GHS 800 to confirm your slot
                                </p>
                            </div>
                            </div>
                            <button
                            onClick={closeModal}
                            disabled={isProcessing}
                            className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                            >
                            <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50'>
                            <div className='flex justify-between text-sm'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Reservation Fee</span>
                            <span className='font-semibold text-zinc-900 dark:text-white'>GHS 800.00</span>
                            </div>
                            <div className='mt-3 flex justify-between text-sm'>
                            <span className='text-zinc-600 dark:text-zinc-400'>For</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.name}</span>
                            </div>
                            <div className='mt-3 flex justify-between text-sm'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Date</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.date}</span>
                            </div>
                            <div className='mt-3 flex justify-between text-sm'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Time</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.time}</span>
                            </div>
                            <div className='mt-3 flex justify-between text-sm'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Numberof Guests</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.guests}</span>
                            </div>
                        </div>

                        <div className='mt-6'>
                            <div className='rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200'>
                            <div className='flex gap-3'>
                                <CreditCard className='h-5 w-5 shrink-0' />
                                <p className='leading-relaxed'>Clicking “Pay Now” implies you agree to the <a className='underline font-semibold' href='#terms'>terms and conditions</a> and will initialize Paystack. You’ll be redirected to complete payment securely.</p>
                            </div>
                            </div>

                            <button
                            type='button'
                            onClick={handlePay}
                            disabled={isProcessing}
                            className='cursor-pointer mt-6 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                            >
                            {isProcessing? 'Processing...' : 'Pay GHS 800 with Paystack'}
                            </button>
                        </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && (
                        <div className='p-8 text-center'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10'
                        >
                            <CheckCircle2 className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                        </motion.div>

                        <h3 className='mt-6 text-2xl font-bold text-zinc-900 dark:text-white'>
                            Booking Confirmed!
                        </h3>
                        <p className='mt-2 text-balance text-sm text-zinc-600 dark:text-zinc-400'>
                            Ref: <span className='font-semibold text-zinc-900 dark:text-white'>{orderRef}</span>
                        </p>
                        <p className='mt-4 text-sm text-zinc-600 dark:text-zinc-400'>
                            We’ve sent confirmation to <span className='font-semibold text-zinc-900 dark:text-white'>{formData.email}</span>
                        </p>

                        <div className='mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm dark:border-white/10 dark:bg-zinc-800/50'>
                            <div className='flex justify-between'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Name</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.name}</span>
                            </div>
                            <div className='mt-3 flex justify-between'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Date</span>
                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.date}</span>
                            </div>
                            <div className='mt-3 flex justify-between'>
                            <span className='text-zinc-600 dark:text-zinc-400'>Amount Paid</span>
                            <span className='font-semibold text-emerald-600 dark:text-emerald-400'>GHS 800.00</span>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className='mt-8 w-full rounded-full border-2 border-zinc-900 py-4 font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black'
                        >
                            Back to Page
                        </button>
                        </div>
                    )}
                    </div>
                </motion.div>
                </div>
            </>
            )}
        </AnimatePresence>
    </div>
  )
}
