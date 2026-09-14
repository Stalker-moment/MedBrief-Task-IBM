import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, ThemeToggle } from '../components/ThemeProvider';
import LandingPage from '../app/page';
import AnalysisPage from '../app/analisis/page';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); localStorage.clear(); document.documentElement.classList.remove('dark'); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Separated pages', () => {
  it('keeps the landing free of medical form controls and links to the analysis route', () => {
    render(<LandingPage />);
    expect(screen.queryByLabelText(/Apa Keluhan/)).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Dari catatan medis');
    for (const link of screen.getAllByRole('link', { name: 'Mulai analisis' })) expect(link.getAttribute('href')).toBe('/analisis');
  });
  it('opens the workspace directly without the landing hero', () => {
    render(<AnalysisPage />);
    expect(screen.getByLabelText(/Apa Keluhan/)).toBeDefined();
    expect(screen.queryByText(/Dari catatan medis,/)).toBeNull();
    expect(screen.getByRole('link', { name: 'Cara kerja' }).getAttribute('href')).toBe('/#cara-kerja');
  });
});

describe('Theme preferences', () => {
  it('follows the device theme on first visit', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: 'Tema gelap' }).getAttribute('aria-pressed')).toBe('true');
  });
  it('retains the chosen theme on remount and leaves form data intact when toggled', () => {
    const view = render(<ThemeProvider><AnalysisPage /></ThemeProvider>);
    fireEvent.change(screen.getByLabelText(/Apa Keluhan/), { target: { value: 'Contoh catatan sintetis' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tema gelap' }));
    expect((screen.getByLabelText(/Apa Keluhan/) as HTMLTextAreaElement).value).toBe('Contoh catatan sintetis');
    expect(localStorage.getItem('medibrief-theme')).toBe('dark');
    expect(localStorage.length).toBe(1);
    view.unmount();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Tema gelap' }));
    expect(localStorage.getItem('medibrief-theme')).toBe('light');
  });
  it('can switch theme when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Tema gelap' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
