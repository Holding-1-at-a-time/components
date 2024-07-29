import { logger } from '@/logger'; // Assume a custom logger implementation
import { MiddlewareConfig } from '@/types/middleware'; // Custom types
import {
  clerkMiddleware
} from '@clerk/nextjs/server';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Configurable route patterns
const DEFAULT_PROTECTED_ROUTES = ['/dashboard/(.*)', '/assessments/(.*)', '/clients/(.*)'];
const DEFAULT_ADMIN_ROUTES = ['/admin/(.*)'];

const createConfigurableMiddleware = (config: MiddlewareConfig) => {
  return clerkMiddleware(async (auth, req) => {
    const start = Date.now();
    const { userId, orgId } = auth;
    const path = req.nextUrl.pathname;

    try {
      // Rate limiting
      const ip = req.ip ?? '127.0.0.1';
      const { success, limit, reset, remaining } = await ratelimit.limit(`mw_${ip}`);
      
      if (!success) {
        logger.warn('Rate limit exceeded', { ip, path });
        return new NextResponse('Too Many Requests', { status: 429 });
      }

      // Multitenancy check
      if (config.requireOrg && !orgId) {
        logger.info('Organization required but not present', { userId, path });
        return NextResponse.redirect(new URL(config.orgSelectionUrl, req.url));
      }

      // Protected route check
      const isProtectedRoute = (config.protectedRoutes || DEFAULT_PROTECTED_ROUTES).some(pattern => 
        new RegExp(`^${pattern}$`).test(path)
      );

      if (isProtectedRoute && !userId) {
        logger.info('Unauthenticated access attempt to protected route', { path });
        return NextResponse.redirect(new URL(config.signInUrl, req.url));
      }

      // Admin route check
      const isAdminRoute = (config.adminRoutes || DEFAULT_ADMIN_ROUTES).some(pattern => 
        new RegExp(`^${pattern}$`).test(path)
      );

      if (isAdminRoute) {
        const { has } = auth;
        if (!has({ permission: "org:sys_memberships:manage" })) {
          logger.warn('Unauthorized access attempt to admin route', { userId, path });
          return NextResponse.redirect(new URL(config.unauthorizedUrl, req.url));
        }
      }

      // Cache permissions for performance (simplified example)
      if (!global.permissionsCache) {
        global.permissionsCache = new Map();
      }
      if (!global.permissionsCache.has(userId)) {
        const userPermissions = await fetchUserPermissions(userId); // Implement this function
        global.permissionsCache.set(userId, userPermissions);
      }

      const response = NextResponse.next();
      
      // Add custom headers for debugging and monitoring
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      return response;
    } catch (error) {
      logger.error('Middleware error', { error, userId, path });
      return NextResponse.redirect(new URL(config.errorUrl, req.url));
    } finally {
      const duration = Date.now() - start;
      logger.info('Middleware execution', { duration, path });
    }
  });
};

export default createConfigurableMiddleware({
  requireOrg: true,
  orgSelectionUrl: '/select-organization',
  signInUrl: '/sign-in',
  unauthorizedUrl: '/unauthorized',
  errorUrl: '/error',
  protectedRoutes: DEFAULT_PROTECTED_ROUTES,
  adminRoutes: DEFAULT_ADMIN_ROUTES,
});

export const config = {
  matcher: ['/((?!_next/image|_next/static|favicon.ico).*)'],
};