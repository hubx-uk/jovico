'use client'
// components/home/EBikeROICalculator.tsx
import { Zap, Fuel, TrendingDown, Calendar, Leaf } from 'lucide-react'
import { useState, useMemo } from 'react'

interface CalcInputs {
    kmPerDay: number
    daysPerWeek: number
    petrolLPerKm: number // petrol consumption (L/100km ÷ 100)
    petrolPriceNaira: number // ₦ per litre
    electricityRateNaira: number // ₦ per kWh
    ebikePriceNaira: number // purchase price
    ebikeWh: number // battery Wh
    ebikeRangeKm: number // range per charge
}

const DEFAULTS: CalcInputs = {
    kmPerDay: 20,
    daysPerWeek: 5,
    petrolLPerKm: 0.08, // 8L/100km typical motorbike
    petrolPriceNaira: 1050, // ₦/litre (adjustable — reflects current Nigeria prices)
    electricityRateNaira: 225, // ₦/kWh
    ebikePriceNaira: 485000,
    ebikeWh: 432, // 36V 12Ah = 432Wh
    ebikeRangeKm: 60,
}

function formatNaira(n: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(n)
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
}

export function EBikeROICalculator() {
    const [inputs, setInputs] = useState<CalcInputs>(DEFAULTS)

    function set(key: keyof CalcInputs, value: number) {
        setInputs((prev) => ({ ...prev, [key]: value }))
    }

    const results = useMemo(() => {
        const {
            kmPerDay,
            daysPerWeek,
            petrolLPerKm,
            petrolPriceNaira,
            electricityRateNaira,
            ebikePriceNaira,
            ebikeWh,
            ebikeRangeKm,
        } = inputs

        const kmPerWeek = kmPerDay * daysPerWeek
        const kmPerYear = kmPerWeek * 52

        // Petrol cost
        const petrolLitresPerKm = petrolLPerKm
        const petrolCostPerKm = petrolLitresPerKm * petrolPriceNaira
        const petrolCostPerYear = petrolCostPerKm * kmPerYear

        // eBike electricity cost
        const whPerKm = ebikeWh / ebikeRangeKm // Wh consumed per km
        const kwhPerKm = whPerKm / 1000
        const electricCostPerKm = kwhPerKm * electricityRateNaira
        const electricCostPerYear = electricCostPerKm * kmPerYear

        const savingsPerYear = petrolCostPerYear - electricCostPerYear
        const savingsPerMonth = savingsPerYear / 12
        const paybackMonths =
            savingsPerYear > 0 ? (ebikePriceNaira / savingsPerYear) * 12 : Infinity
        const paybackYears = paybackMonths / 12

        // CO₂ savings (petrol ≈ 2.31 kg CO₂/litre)
        const petrolLitresPerYear = petrolLitresPerKm * kmPerYear
        const co2SavedKg = petrolLitresPerYear * 2.31

        return {
            kmPerYear,
            petrolCostPerYear,
            electricCostPerYear,
            savingsPerYear,
            savingsPerMonth,
            paybackMonths,
            paybackYears,
            co2SavedKg: Math.round(co2SavedKg),
            costPerKmPetrol: petrolCostPerKm,
            costPerKmElectric: electricCostPerKm,
        }
    }, [inputs])

    const savingsPositive = results.savingsPerYear > 0

    return (
        <section className='jv-section bg-slate-50'>
            <div className='jv-container'>
                {/* Header */}
                <div className='text-center mb-10 sm:mb-12'>
                    <p className='text-green-500 font-semibold text-sm uppercase tracking-wider mb-2'>
                        Savings Calculator
                    </p>
                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3'>
                        How Much Will You Save?
                    </h2>
                    <p className='text-slate-500 text-base md:text-lg max-w-xl mx-auto'>
                        Compare the real cost of riding a Jovico eBike versus a petrol-powered
                        motorbike or keke. Adjust the numbers to match your situation.
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-8'>
                    {/* Inputs */}
                    <div className='bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-6'>
                        <h3 className='font-bold text-slate-900 text-lg'>Your Riding Profile</h3>

                        {/* Distance */}
                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <label className='text-sm font-semibold text-slate-700'>
                                    Daily Distance
                                </label>
                                <span className='text-sm font-bold text-slate-900 tabular-nums'>
                                    {inputs.kmPerDay} km/day
                                </span>
                            </div>
                            <input
                                type='range'
                                min={2}
                                max={100}
                                step={1}
                                value={inputs.kmPerDay}
                                onChange={(e) => set('kmPerDay', Number(e.target.value))}
                                className='w-full accent-green-500 cursor-pointer'
                            />
                            <div className='flex justify-between text-xs text-slate-400 mt-1'>
                                <span>2km</span>
                                <span>100km</span>
                            </div>
                        </div>

                        {/* Days per week */}
                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <label className='text-sm font-semibold text-slate-700'>
                                    Days per Week
                                </label>
                                <span className='text-sm font-bold text-slate-900 tabular-nums'>
                                    {inputs.daysPerWeek} days
                                </span>
                            </div>
                            <input
                                type='range'
                                min={1}
                                max={7}
                                step={1}
                                value={inputs.daysPerWeek}
                                onChange={(e) => set('daysPerWeek', Number(e.target.value))}
                                className='w-full accent-green-500 cursor-pointer'
                            />
                            <div className='flex justify-between text-xs text-slate-400 mt-1'>
                                <span>1 day</span>
                                <span>7 days</span>
                            </div>
                        </div>

                        <div className='border-t border-slate-100 pt-5'>
                            <h3 className='font-bold text-slate-900 text-sm mb-4 flex items-center gap-2'>
                                <Fuel className='w-4 h-4 text-orange-500' />
                                Petrol Vehicle Costs
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        Fuel Price (₦/litre)
                                    </label>
                                    <input
                                        type='number'
                                        min={500}
                                        max={3000}
                                        step={50}
                                        value={inputs.petrolPriceNaira}
                                        onChange={(e) =>
                                            set(
                                                'petrolPriceNaira',
                                                clamp(Number(e.target.value), 500, 3000)
                                            )
                                        }
                                        className='jv-input text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        Fuel Consumption (L/100km)
                                    </label>
                                    <input
                                        type='number'
                                        min={3}
                                        max={20}
                                        step={0.5}
                                        value={Math.round(inputs.petrolLPerKm * 100 * 10) / 10}
                                        onChange={(e) =>
                                            set('petrolLPerKm', Number(e.target.value) / 100)
                                        }
                                        className='jv-input text-sm'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='border-t border-slate-100 pt-5'>
                            <h3 className='font-bold text-slate-900 text-sm mb-4 flex items-center gap-2'>
                                <Zap className='w-4 h-4 text-green-500' />
                                eBike Settings
                            </h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        eBike Purchase Price (₦)
                                    </label>
                                    <input
                                        type='number'
                                        min={100000}
                                        max={2000000}
                                        step={10000}
                                        value={inputs.ebikePriceNaira}
                                        onChange={(e) =>
                                            set('ebikePriceNaira', Number(e.target.value))
                                        }
                                        className='jv-input text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        Electricity Rate (₦/kWh)
                                    </label>
                                    <input
                                        type='number'
                                        min={50}
                                        max={1000}
                                        step={10}
                                        value={inputs.electricityRateNaira}
                                        onChange={(e) =>
                                            set('electricityRateNaira', Number(e.target.value))
                                        }
                                        className='jv-input text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        Battery Capacity (Wh)
                                    </label>
                                    <input
                                        type='number'
                                        min={200}
                                        max={2000}
                                        step={50}
                                        value={inputs.ebikeWh}
                                        onChange={(e) => set('ebikeWh', Number(e.target.value))}
                                        className='jv-input text-sm'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-600 mb-1.5'>
                                        Range per Charge (km)
                                    </label>
                                    <input
                                        type='number'
                                        min={20}
                                        max={200}
                                        step={5}
                                        value={inputs.ebikeRangeKm}
                                        onChange={(e) =>
                                            set('ebikeRangeKm', Number(e.target.value))
                                        }
                                        className='jv-input text-sm'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results panel */}
                    <div className='space-y-4'>
                        {/* Big savings card */}
                        <div
                            className={`rounded-3xl p-6 sm:p-8 text-white ${savingsPositive ? 'bg-green-500' : 'bg-slate-700'}`}
                        >
                            <div className='flex items-center gap-2 mb-1 opacity-80 text-sm font-semibold uppercase tracking-wider'>
                                <TrendingDown className='w-4 h-4' />
                                Annual Savings
                            </div>
                            <div className='text-4xl sm:text-5xl font-extrabold tabular-nums mb-1'>
                                {savingsPositive ? '+' : ''}
                                {formatNaira(results.savingsPerYear)}
                            </div>
                            <div className='opacity-75 text-sm'>
                                {formatNaira(Math.abs(results.savingsPerMonth))}/month vs petrol
                            </div>
                        </div>

                        {/* Cost comparison */}
                        <div className='bg-white rounded-3xl border border-slate-100 p-6 space-y-4'>
                            <h3 className='font-bold text-slate-900 text-sm'>
                                Annual Cost Breakdown
                            </h3>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0'>
                                        <Fuel className='w-4 h-4 text-orange-600' />
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-slate-600'>
                                                Petrol cost
                                            </span>
                                            <span className='font-bold text-slate-900 tabular-nums'>
                                                {formatNaira(results.petrolCostPerYear)}
                                            </span>
                                        </div>
                                        <div className='w-full bg-slate-100 rounded-full h-1.5 mt-1.5'>
                                            <div
                                                className='bg-orange-400 h-1.5 rounded-full transition-all duration-500'
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0'>
                                        <Zap className='w-4 h-4 text-green-600' />
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm text-slate-600'>
                                                eBike electricity
                                            </span>
                                            <span className='font-bold text-slate-900 tabular-nums'>
                                                {formatNaira(results.electricCostPerYear)}
                                            </span>
                                        </div>
                                        <div className='w-full bg-slate-100 rounded-full h-1.5 mt-1.5'>
                                            <div
                                                className='bg-green-500 h-1.5 rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${Math.min(100, (results.electricCostPerYear / results.petrolCostPerYear) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='text-xs text-slate-400 pt-1'>
                                Per km: {formatNaira(results.costPerKmPetrol)} petrol vs{' '}
                                {formatNaira(results.costPerKmElectric)} electric
                            </div>
                        </div>

                        {/* Payback period */}
                        <div className='bg-white rounded-3xl border border-slate-100 p-6'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0'>
                                    <Calendar className='w-4 h-4 text-blue-600' />
                                </div>
                                <h3 className='font-bold text-slate-900 text-sm'>
                                    Break-Even Point
                                </h3>
                            </div>
                            {results.paybackYears <= 10 ? (
                                <>
                                    <div className='text-3xl font-extrabold text-slate-900 tabular-nums'>
                                        {results.paybackMonths < 12
                                            ? `${Math.round(results.paybackMonths)} months`
                                            : `${results.paybackYears.toFixed(1)} years`}
                                    </div>
                                    <p className='text-xs text-slate-500 mt-1'>
                                        After that, every kilometre is pure savings
                                    </p>
                                </>
                            ) : (
                                <p className='text-sm text-slate-500'>
                                    Adjust your inputs — increase daily distance to see a faster
                                    payback
                                </p>
                            )}
                        </div>

                        {/* CO2 savings */}
                        <div className='bg-slate-900 rounded-3xl p-6 text-white'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0'>
                                    <Leaf className='w-4 h-4 text-green-400' />
                                </div>
                                <h3 className='font-bold text-sm'>Environmental Impact</h3>
                            </div>
                            <div className='text-3xl font-extrabold tabular-nums text-green-400'>
                                {results.co2SavedKg.toLocaleString()} kg
                            </div>
                            <p className='text-slate-400 text-xs mt-1'>
                                CO₂ saved per year vs petrol
                            </p>
                        </div>

                        {/* CTA */}
                        <a
                            href='/shop'
                            className='jv-btn-green w-full justify-center text-base !py-4 !rounded-2xl'
                        >
                            Shop eBikes & Start Saving <Zap className='w-5 h-5' />
                        </a>
                    </div>
                </div>

                <p className='text-center text-xs text-slate-400 mt-6'>
                    * Estimates are based on your inputs. Actual savings may vary based on riding
                    style, terrain, maintenance costs, and current fuel/electricity prices in
                    Nigeria.
                </p>
            </div>
        </section>
    )
}
