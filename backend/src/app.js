const app = express();
app.use(express.json());
app.use(helmet());

app.use(cors({
    origin: 'http://localhost', // ou l'URL exacte de votre front
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

console.log('Starting application...');