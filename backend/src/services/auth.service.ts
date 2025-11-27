import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/error.handler';

export class AuthService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async login(username: string, password: string) {
    const usuario = await this.usuarioRepository.findByUsername(username);

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValidPassword = await bcrypt.compare(password, usuario.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = generateToken({
      userId: usuario.id,
      rol: usuario.rol.nombre,
      sucursalId: usuario.sucursalId || undefined,
    });

    return {
      token,
      rol: usuario.rol.nombre,
      sucursalId: usuario.sucursalId || null,
    };
  }
}

