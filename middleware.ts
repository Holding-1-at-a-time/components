import { logger } from '@/edge-logger';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const permissionsCache = new Map<string, Set<string>>();

const createConfigurableMiddleware = (config: MiddlewareConfig, cache?: Map<string, Set<string>>) => {
  return clerkMiddleware<MiddlewareConfig>(async (auth, req) => {
    const start = Date.now();
    const { userId, orgId } = auth;
    const path = req.nextUrl.pathname;
    let error: Error | null = null;

    try {
      // Rate limiting
      const ip = req.socket.remoteAddress ?? '127.0.0.1';
      const { success, limit, reset, remaining } = await ratelimit.limit(`rate_limit_${ip}`);
      if (!success) {
        logger.warn('Rate limit exceeded', { ip, path });
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    } finally {
      // ... rest of the code
    }

    // Multitenancy check
    if (config.requireOrg && !orgId) {
      logger.info('Organization required but not present', { userId, path });
      return NextResponse.redirect(new URL(config.orgSelectionUrl, req.url));
    }

    // Protected route check
    const isProtectedRoute = (config.protectedRoutes || defaultMiddlewareConfig.protectedRoutes).some(pattern =>
      new RegExp(`^${pattern}$`).test(path)
    );

    if (isProtectedRoute && !userId) {
      logger.info('Unauthenticated access attempt to protected route', { path });
      return NextResponse.redirect(new URL(config.signInUrl, req.url));
    }

    // Admin route check
    const isAdminRoute = (config.adminRoutes || defaultMiddlewareConfig.adminRoutes).some(pattern =>
      new RegExp(`^${pattern}$`).test(path)
    );

    if (isAdminRoute) {
      const { has } = auth;
      if (!has({ permission: "org:sys_memberships:manage" })) {
        logger.warn('Unauthorized access attempt to admin route', { userId, path });
        return NextResponse.redirect(new URL(config.unauthorizedUrl, req.url));
      }
    }

    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());


    // Log the response for debugging
    logger.info('Middleware response', { status: response.status, headers: response.headers });
    try {
      await fetch(config.fetchUrl);
    } catch (error) {
      logger.error('Middleware error', { error: error.message, userId, path });
      return NextResponse.redirect(new URL(config.errorUrl, req.url));
    } finally {
      const duration = Date.now() - start;
      logger.info('Middleware execution', { duration, path });
    }
  }, cache);
}

export default clerkMiddleware()