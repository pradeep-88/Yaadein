import React, { useState } from 'react'
import axios from '../../services/axiosInstances'

const MAX_LEN = 40
const NAME_RGX = /^[\w\- ]+$/ // letters, numbers, underscore, dash, space

export default function CreateFolderForm({ onFolderCreated }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmed = name.trim()
  const invalid =
    (touched && trimmed.length === 0) ||
    trimmed.length > MAX_LEN ||
    (trimmed.length > 0 && !NAME_RGX.test(trimmed))

  const helperText = (() => {
    if (!touched) return ' '
    if (trimmed.length === 0) return 'Folder name is required.'
    if (trimmed.length > MAX_LEN) return `Max ${MAX_LEN} characters.`
    if (!NAME_RGX.test(trimmed)) return 'Only letters, numbers, spaces, - and _.'
    return ' '
  })()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setError('')
    if (invalid) return
    setLoading(true)
    try {
      await axios.post('/upload/folder', { name: trimmed })
      setName('')
      onFolderCreated && onFolderCreated()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create folder')
    } finally {
      setLoading(false)
    }
  }

  const charsLeft = Math.max(0, MAX_LEN - trimmed.length)
  const showError = Boolean(error) || (touched && invalid)

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Shell with animated-looking gradient border (no custom CSS needed) */}
      <div className="rounded-xl p-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500">
        <div className="rounded-[11px] bg-white/90 backdrop-blur-md px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            {/* Input field */}
            <div className="relative flex-1">
              {/* Leading icon */}
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                viewBox="0 0 24 24" fill="none"
                aria-hidden="true"
              >
                <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2"/>
              </svg>

              {/* Status icon (valid/invalid) */}
              {touched && trimmed && (
                <svg
                  className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    invalid ? 'text-red-500' : 'text-emerald-500'
                  }`}
                  viewBox="0 0 24 24" fill="none" aria-hidden="true"
                >
                  {invalid ? (
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  ) : (
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  )}
                </svg>
              )}

              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); if (!touched) setTouched(true) }}
                onBlur={() => setTouched(true)}
                placeholder="New folder name"
                maxLength={80}
                disabled={loading}
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border transition outline-none
                  ${invalid
                    ? 'border-red-400 focus:border-red-500 ring-2 ring-red-200'
                    : 'border-slate-200 focus:border-blue-500 ring-2 ring-blue-200/60 focus:ring-blue-300/80'}
                  bg-white/80 text-slate-800 placeholder:text-slate-400`}
                aria-invalid={invalid}
                aria-describedby="folder-helper"
              />

              {/* Bottom row: helper + counter */}
              <div className="mt-1 flex items-center justify-between text-xs">
                <span
                  id="folder-helper"
                  className={`${invalid ? 'text-red-600' : 'text-slate-500'}`}
                >
                  {showError ? (error || helperText) : ' '}
                </span>
                <span className={`tabular-nums ${charsLeft < 10 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {charsLeft} left
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || invalid}
              aria-busy={loading}
              className={`relative rounded-lg px-4 py-2.5 font-semibold text-white
                bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500
                shadow-lg shadow-indigo-300/30 transition
                hover:brightness-[1.05] active:scale-[0.99]
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" role="status" aria-label="loading">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
                  </svg>
                  Creating…
                </span>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
