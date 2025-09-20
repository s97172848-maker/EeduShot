# EduSpark Color System & Components

## 🎨 Brand Colors

### Primary Colors
- **Primary Blue**: `#00ADEF` - Bright, electric blue for main elements
- **Secondary Orange**: `#FFA500` - Vibrant orange for secondary elements  
- **Accent Yellow**: `#FFD700` - Lightning yellow for highlights and accents

### Background Colors
- **Dark Background**: `#000000` - Pure black
- **Dark Blue**: `#1a1a2e` - Deep blue for gradients
- **Navy**: `#16213e` - Navy blue for depth

### Text Colors
- **White Text**: `#FFFFFF` - Primary text
- **Light Gray**: `#D1D5DB` - Secondary text
- **Gray**: `#9CA3AF` - Tertiary text
- **Dark Gray**: `#6B7280` - Subtle text

## 📁 File Structure

```
constants/
├── Colors.ts          # Color constants and gradients
components/
├── Logo.tsx           # Reusable logo component
app/
├── index.tsx          # Main splash screen
```

## 🧩 Components

### Logo Component
```tsx
import { Logo } from "../components/Logo";

// Usage
<Logo size={128} showGlow={true} />
```

**Props:**
- `size`: Logo size in pixels (default: 128)
- `showGlow`: Enable/disable glow effects (default: true)
- `style`: Additional ImageStyle props

### Color Constants
```tsx
import { COLORS, GRADIENTS } from "../constants/Colors";

// Usage
<View style={{ backgroundColor: COLORS.PRIMARY }} />
<LinearGradient colors={GRADIENTS.BACKGROUND} />
```

## 🎯 Usage Examples

### Using Brand Colors
```tsx
// Primary elements
<Text style={{ color: COLORS.PRIMARY }}>EduSpark</Text>

// Secondary elements  
<View style={{ backgroundColor: COLORS.SECONDARY }} />

// Accent highlights
<View style={{ borderColor: COLORS.ACCENT }} />
```

### Using Gradients
```tsx
// Background gradient
<LinearGradient colors={GRADIENTS.BACKGROUND} />

// Brand gradient
<LinearGradient colors={GRADIENTS.BRAND} />
```

### Using Opacity Variants
```tsx
// Semi-transparent elements
<View style={{ backgroundColor: COLORS.PRIMARY_OPACITY_30 }} />

// Glow effects
<View style={{ backgroundColor: COLORS.PRIMARY_GLOW }} />
```

## 🚀 Splash Screen Features

The EduSpark splash screen includes:

- ✅ **Logo Integration**: Uses `LOGO.png` with glow effects
- ✅ **Brand Colors**: Implements the complete color palette
- ✅ **Typography**: Poppins fonts for headings and text
- ✅ **Animations**: Smooth fade-in, scale, and slide effects
- ✅ **Responsive Design**: Adapts to different screen sizes
- ✅ **Loading States**: Animated progress indicator
- ✅ **Brand Messaging**: "Education and Energy, Inspiration and Creativity"

## 🎨 Color Palette Reference

| Purpose | Color | HEX | Usage |
|---------|-------|-----|-------|
| Primary | Bright Blue | `#00ADEF` | Main buttons, links, highlights |
| Secondary | Vibrant Orange | `#FFA500` | Secondary actions, accents |
| Accent | Lightning Yellow | `#FFD700` | Special highlights, warnings |
| Background | Dark | `#000000` | Main backgrounds |
| Text | White | `#FFFFFF` | Primary text |
| Text | Light Gray | `#D1D5DB` | Secondary text |

## 🔧 Development Notes

- All colors are centralized in `constants/Colors.ts`
- Logo component is reusable across the app
- Animations use native driver for performance
- Font loading includes fallback handling
- Tailwind CSS warnings have been resolved 