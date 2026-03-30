import type { ReactNode } from 'react'
import './modal.css'

interface ModalProps {
  open: boolean
  children: ReactNode
}

export function Modal({ open, children }: ModalProps) {
  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        {children}
      </div>
    </div>
  )
}
