import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { MedicalRecordInput } from '../components/MedicalRecordInput';

describe('Frontend Component Smoke Tests', () => {
  it('renders Header with permanent medical disclaimer and branding', () => {
    render(<Header />);
    expect(screen.getAllByText(/MediBrief/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/BUKAN pengganti dokter/i)).toBeDefined();
  });

  it('renders DisclaimerNotice without storing medical notes', () => {
    render(<DisclaimerNotice />);
    expect(screen.getByText(/Privasi Tanpa Penyimpanan/i)).toBeDefined();
    expect(screen.getByText(/Batasan Klinis/i)).toBeDefined();
  });

  it('renders MedicalRecordInput in Guided Form mode and populates preset', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <MedicalRecordInput
        onSubmit={onSubmit}
        isLoading={false}
        onCancel={onCancel}
      />
    );

    // Verify Guided mode is active by default
    expect(screen.getByText(/Form Terpandu \(Orang Awam\)/i)).toBeDefined();
    expect(screen.getByText(/Profil Pasien & Keluhan Utama/i)).toBeDefined();

    // Click preset button
    const presetBtn = screen.getByText(/Tensi & Gula Darah/i);
    fireEvent.click(presetBtn);

    // Verify input fields populated
    const complaintInput = screen.getByPlaceholderText(/Ceritakan dengan bahasa bebas/i) as HTMLTextAreaElement;
    expect(complaintInput.value).toContain('Sakit kepala');
  });

  it('switches to Raw Mode and loads synthetic default sample on button click', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <MedicalRecordInput
        onSubmit={onSubmit}
        isLoading={false}
        onCancel={onCancel}
      />
    );

    // Switch to Raw Mode
    const rawModeBtn = screen.getByText(/Catatan Bebas \(Dokter \/ Nakes\)/i);
    fireEvent.click(rawModeBtn);

    const defaultBtn = screen.getByText(/Contoh Default/i);
    fireEvent.click(defaultBtn);

    const textarea = screen.getByLabelText(/Isi Catatan Rekam Medis/i) as HTMLTextAreaElement;
    expect(textarea.value.length).toBeGreaterThan(100);
    expect(textarea.value).toContain('Hipertensi');
  });
});
