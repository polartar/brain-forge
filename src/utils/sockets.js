/**
 * Module to create and store persistent websockets.
 */
import { SOCKET_PATH } from 'config/base'

let notificationSocket

/**
 * Get or create a peristent notification socket.
 * @param {Integer} user_id ID of the logged in user.
 */
export const getNotificationSocket = (user_id) => {
    if (!notificationSocket) {
        const url = `${SOCKET_PATH}/ws/notifications/${user_id}/`
        const socket = new WebSocket(url)
        notificationSocket = socket
    }
    return notificationSocket
}
