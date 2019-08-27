<%@ page language="java"
    contentType="application/vnd.ms-excel; charset=euc-kr"
    pageEncoding="EUC-KR" import="java.util.*"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%@ page import="java.text.SimpleDateFormat"%>
<%
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
    String today = format.format(new Date());

    response.setHeader("Content-Type", "application/vnd.ms-xls");
    response.setHeader("Content-Disposition", "attachment; filename=client_pay_" + today + ".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko" style="overflow: hidden">
<head>
<meta http-equiv="content-type" content="text/html; euc-kr" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>���� �ٿ�ε�</title>
<style>
.table-wrapper-scroll-y {
    display: block;
    max-height: 700px;
    overflow-y: auto;
    -ms-overflow-style: -ms-autohiding-scrollbar;
}
td, th {border:1px solid gray}
</style>
</head>
<body>
    <table style="background: #ffffff">
    	<tbody>
    		<tr>
    			<th style="border:none">����Ⱓ</th>
    			<td colspan="3" style="border:none">${info.startDt} ~ ${info.endDt}</td>
    		</tr>
    		<tr>
    			<td style="border:none"></td>
    		</tr>
    		<tr>
    			<th style="background-color:#eeeeee">��ü��</th>
    			<th style="background-color:#eeeeee">�����</th>
    			<th style="background-color:#eeeeee">���Ǹ�</th>
    			<th style="background-color:#eeeeee">���ǱⰣ</th>
    			<th style="background-color:#eeeeee">���ǽð�</th>
    			<th style="background-color:#eeeeee">����Ƚ��</th>
    			<th style="background-color:#eeeeee">����</th>
    			<th style="background-color:#eeeeee">�ܰ�</th>
    			<th style="background-color:#eeeeee">�鼼����</th>
    			<th style="background-color:#eeeeee">��Ÿ�׸�</th>
    			<th style="background-color:#eeeeee">û���ݾ�</th>
    			<th style="background-color:#eeeeee">��������ݾ�</th>
    			<th style="background-color:#eeeeee">�� û���ݾ�</th>
    			<th style="background-color:#eeeeee">�� VAT</th>
    			<th style="background-color:#eeeeee">�� �ݾ�</th>
    			<th style="background-color:#eeeeee">���</th>
    			<th style="background-color:#eeeeee">��������</th>
    			<th style="background-color:#eeeeee">����Ϸ�</th>
    		</tr>
        	<c:forEach var="x" items="${list}" varStatus="status">
        		<tr>
        			<td>${x.compNm}</td>
        			<td>${x.teacherNm}</td>
        			<td>${x.lectureNm}</td>
        			<td>${x.startDt} ~ ${x.endDt}</td>
        			<td>
        				<c:forEach var="y" items="${x.schedules}" varStatus="status2">
        					${y}<br>
        				</c:forEach>
        			</td>
        			<td style="text-align:center">${x.attCnt}</td>
        			<td style="text-align:center">${x.feeUnitNm}</td>
        			<td><fmt:formatNumber value="${x.tuitionFee}" pattern="#,###" /></td>
        			<td style="text-align:center">${x.freeYnNm}</td>
        			<td><fmt:formatNumber value="${x.addMoney}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.totalFee}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.lastMoney}" pattern="#,###" /></td>
        			
        			<td><fmt:formatNumber value="${x.lastMoney + x.addMoney}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.totalVat}" pattern="#,###" /></td>
        			<td><fmt:formatNumber value="${x.lastMoney + x.addMoney + x.totalVat}" pattern="#,###" /></td>

        			<td>${x.lastRemark}</td>
        			<td>
        				<c:forEach var="y" items="${x.dayList }" varStatus="status2">
        					[${y.month}��] ${y.day}<br>
        				</c:forEach>
					</td>
        			<td>${x.complete}</td>
        		</tr>
        		<c:if test="${fn:length(x.itemList) > 0 }">
        			<tr>
        				<th colspan="10" style="border:none"></th>
        				<th style="background-color:#eeeeee">�׸�</th>
        				<th style="background-color:#eeeeee">�ܰ�</th>
        				<th style="background-color:#eeeeee">����</th>
        				<th style="background-color:#eeeeee">�ݾ�</th>
        				<th style="background-color:#eeeeee">�鼼����</th>
        				<th style="background-color:#eeeeee">����</th>
        			</tr>
        			<c:forEach var="y" items="${x.itemList }" varStatus="status2">
        				<tr>
        					<td colspan="10" style="border:none"></td>
        					<td>${y.itemCnts}</td>
        					<td><fmt:formatNumber value="${y.cost}" pattern="#,###" /></td>
        					<td><fmt:formatNumber value="${y.qnty}" pattern="#,###" /></td>
        					<td><fmt:formatNumber value="${y.cost * y.qnty}" pattern="#,###" /></td>
        					<td>${y.freeYnNm}</td>
        					<td>${y.selectDt}</td>
        				</tr>
        			</c:forEach>
        		</c:if>
            </c:forEach>
        </tbody>
    </table>
 
</body>
</html>
