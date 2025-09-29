# Voice Lab Frontend

A beautiful Next.js application for AI-powered voice tools including Text-to-Speech and Voice Conversion, built with NextAuth authentication and a stunning pastel purple design.

## Features

- **Authentication**: NextAuth with credentials provider (demo/local store)
- **Text-to-Speech**: Convert text to speech using StyleTTS2 backend
- **Voice Conversion**: Transform voices using SeedVC backend  
- **Beautiful UI**: Frosted glass cards with pastel purple Pinterest-style design
- **File Upload**: Server-side S3 upload for voice conversion
- **Audio Playback**: Built-in audio players with download functionality
- **Recent History**: Keep track of recent generations and conversions
- **Responsive**: Mobile-friendly responsive design
- **Accessible**: WCAG compliant with proper ARIA attributes

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom pastel palette
- **Authentication**: NextAuth (Credentials provider)
- **HTTP Client**: Axios (2 instances for TTS and SeedVC)
- **Forms**: React Hook Form
- **Icons**: Heroicons
- **Cloud Storage**: AWS S3 for file uploads

## Setup

### Prerequisites

Make sure you have the following backends running:

- **StyleTTS2**: http://localhost:8000 (Authorization: `12345`)
- **SeedVC**: http://localhost:8001 (Authorization: `Bearer 12345`)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
# or
pnpm install
```

2. Create your environment file:

```bash
cp .env.local.example .env.local
```

3. Configure your `.env.local` file:

```env
NEXT_PUBLIC_TTS_API_BASE=http://localhost:8000
NEXT_PUBLIC_SEEDVC_API_BASE=http://localhost:8001
NEXT_PUBLIC_TTS_AUTH=12345
NEXT_PUBLIC_SEEDVC_AUTH=Bearer 12345

# For server-side S3 upload route — must match backend S3 config used by your FastAPIs
S3_BUCKET=elevenlabs-clone-jas
AWS_REGION=us-east-1
# Optional — include these if you want the frontend server to upload directly to S3
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Navigate to the application
2. Create a new account with email/password
3. Sign in to access the voice tools

### Text-to-Speech

1. Enter text in the text area (up to 1000 characters)
2. Select a voice from the dropdown
3. Click "Generate Audio" 
4. Play the generated audio or download it
5. View recent generations in the history section

### Voice Conversion

1. Upload an audio file (drag & drop or click to browse)
2. Wait for the file to upload to S3
3. Select a target voice from the dropdown
4. Click "Convert Voice"
5. Play the converted audio or download it
6. View recent conversions in the history section

## API Integration

The application integrates with two backend services:

### StyleTTS2 (Port 8000)
- `GET /health` - Health check
- `GET /voices` - Get available voices
- `POST /generate` - Generate TTS audio

### SeedVC (Port 8001)
- `GET /health` - Health check  
- `GET /voices` - Get available voices
- `POST /convert` - Convert voice with S3 audio key

### Server-side Upload
- `POST /api/upload` - Upload audio files to S3

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth configuration
│   │   │   └── signup/route.ts         # Sign up API
│   │   └── upload/route.ts             # S3 upload API
│   ├── auth/page.tsx                   # Authentication page
│   ├── profile/page.tsx                # User profile
│   └── page.tsx                        # Main voice tools page
├── components/
│   ├── AuthForm.tsx                    # Sign in/up form
│   ├── TextToSpeechCard.tsx           # TTS interface
│   ├── VoiceConversionCard.tsx        # Voice conversion interface
│   ├── TopNav.tsx                     # Navigation bar
│   ├── FrostedCard.tsx                # Reusable card component
│   ├── Toast.tsx                      # Notification system
│   └── LavenderBlobs.tsx              # Background animations
└── lib/
    ├── api.ts                         # Axios clients
    └── auth-server.ts                 # Server-side auth helpers
```

## Customization

### Styling
- Colors are defined in `tailwind.config.ts`
- Custom animations in `app/globals.css`
- Frosted glass effect in `FrostedCard.tsx`

### Backend Integration
- Modify `lib/api.ts` to change API endpoints or headers
- Update form validation in component files

### Authentication
- User storage is file-based (`users.json`) for demo purposes
- Extend `lib/auth-server.ts` for database integration

## Troubleshooting

### Common Issues

1. **Backend not responding**: Ensure both StyleTTS2 and SeedVC services are running on correct ports
2. **File upload fails**: Check AWS credentials and S3 bucket configuration
3. **Authentication issues**: Verify NEXTAUTH_SECRET is set in environment
4. **CORS errors**: Ensure backends allow requests from http://localhost:3000

### Testing Backend APIs

Test the backends directly with curl:

```bash
# Test StyleTTS2 voices
curl -X GET "http://localhost:8000/voices" -H "Authorization: 12345"

# Test SeedVC voices  
curl -X GET "http://localhost:8001/voices" -H "Authorization: Bearer 12345"
```

## Development

### Adding New Features

1. **New API endpoints**: Add to `lib/api.ts`
2. **New components**: Create in `components/` directory
3. **New pages**: Add to `app/` directory
4. **Styling updates**: Modify `tailwind.config.ts`

### Code Style

- Uses TypeScript with strict mode
- Follows React hooks patterns
- Responsive-first design approach
- Accessibility-focused components

## License

This project is for demonstration purposes. Please ensure you have proper licensing for any AI models used in the backend services.