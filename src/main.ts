import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión Médica API')
    .setDescription(`
      API para el sistema de gestión médica que incluye:
      - Gestión de usuarios (pacientes, doctores, administradores)
      - Gestión de fórmulas médicas
      - Historial médico de pacientes
      - Bancos de preguntas para seguimiento
      - Respuestas de seguimiento de pacientes
      
      ## Autenticación
      La API utiliza JWT (JSON Web Tokens) para la autenticación. 
      Para acceder a los endpoints protegidos, incluye el token en el header:
      \`Authorization: Bearer <tu-token>\`
      
      ## Roles de Usuario
      - **ADMIN**: Acceso completo al sistema
      - **DOCTOR**: Puede gestionar historiales y ver información de pacientes
      - **PATIENT**: Acceso limitado a sus propias fórmulas y respuestas
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticación')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Formulas', 'Gestión de fórmulas médicas')
    .addTag('Historial', 'Historial médico de pacientes')
    .addTag('Question Banks', 'Bancos de preguntas para seguimiento')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Sistema Médico API',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // Configuración de CORS para producción
  app.enableCors({
    origin: [
      'https://omeopatics-front-vite.vercel.app', // Frontend en producción
      'http://localhost:5173' // Frontend en desarrollo local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
