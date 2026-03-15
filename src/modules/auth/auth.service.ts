import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userType = dto.userType?.toUpperCase() || 'DONOR';
    
    if (!['DONOR', 'CLIENT'].includes(userType)) {
      throw new BadRequestException('User type must be DONOR or CLIENT');
    }

    const defaultRole = await this.prisma.role.findUnique({
      where: { name: userType },
    });

    if (!defaultRole) {
      throw new BadRequestException(`Role '${userType}' not found. Please contact support.`);
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        bloodGroup: dto.bloodGroup,
        userType: userType,
        roleId: defaultRole?.id,
        lastDonationDate: dto.lastDonationDate,
      },
      include: { role: true },
    });

    if (userType === 'DONOR') {
      await this.prisma.donorProfile.create({
        data: {
          userId: user.id,
          mobile: dto.phone,
          availableStatus: 'AVAILABLE',
        },
      });
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: { include: { permissions: true } } },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken: dto.refreshToken },
      include: { role: { include: { permissions: true } } },
    });

    if (!user || !user.refreshTokenExp || user.refreshTokenExp < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null, refreshTokenExp: null },
    });
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, userType: user.userType };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, token: string) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 7);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token, refreshTokenExp: expDate },
    });
  }

  private sanitizeUser(user: any) {
    const { password, refreshToken, refreshTokenExp, ...result } = user;
    return result;
  }
}