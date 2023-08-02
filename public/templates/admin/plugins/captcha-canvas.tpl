<div class="row">
    <div class="col">
        <div class="panel panel-default">
            <div class="panel-heading">Canvas Captcha Failures Report</div>
            <div class="panel-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>[[nodebb-plugin-captcha-canvas:admin_counter_name]]</th>
                            <th>[[nodebb-plugin-captcha-canvas:admin_counter_value]]</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_failures_session]]</td>
                            <td><p class="text-right">{counters.invalid_session}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_failures_empty]]</td>
                            <td><p class="text-right">{counters.empty}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_failures_honeypot]]</td>
                            <td><p class="text-right">{counters.honeypot}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_failures_nan]]</td>
                            <td><p class="text-right">{counters.not_a_number}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_failures_wrong]]</td>
                            <td><p class="text-right">{counters.wrong}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_total_failures_count]]</td>
                            <td><p class="text-right">{counters.total_failures}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_correct_count]]</td>
                            <td><p class="text-right">{counters.correct}</p></td>
                        </tr>
                        <tr>
                            <td>[[nodebb-plugin-captcha-canvas:admin_created_count]]</td>
                            <td><p class="text-right">{counters.created}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
